import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

import { env } from '../config/env.js';
import { AppError } from '../lib/app-error.js';
import type { AuthTokenPayload, AuthUser, SessionRecord } from './auth.types.js';

const usersByEmail = new Map<string, AuthUser>();
const usersById = new Map<string, AuthUser>();
const sessions = new Map<string, SessionRecord>();

const REFRESH_COOKIE_NAME = 'refresh_token';

export function getRefreshCookieName() {
  return REFRESH_COOKIE_NAME;
}

function signAccessToken(user: AuthUser) {
  const payload: AuthTokenPayload = {
    email: user.email,
    fullName: user.fullName,
    sub: user.id,
  };

  return jwt.sign(payload, env.accessTokenSecret, {
    expiresIn: env.accessTokenTtl,
  });
}

function createRefreshToken(userId: string) {
  const token = randomUUID();
  sessions.set(token, {
    expiresAt: Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
    userId,
  });
  return token;
}

function buildAuthPayload(user: AuthUser) {
  return {
    accessToken: signAccessToken(user),
    user: {
      email: user.email,
      fullName: user.fullName,
      id: user.id,
    },
  };
}

export async function registerUser(input: { email: string; fullName: string; password: string }) {
  if (usersByEmail.has(input.email)) {
    throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'A user with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user: AuthUser = {
    email: input.email,
    fullName: input.fullName,
    id: randomUUID(),
    passwordHash,
  };

  usersByEmail.set(user.email, user);
  usersById.set(user.id, user);

  return {
    ...buildAuthPayload(user),
    refreshToken: createRefreshToken(user.id),
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = usersByEmail.get(input.email);
  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  return {
    ...buildAuthPayload(user),
    refreshToken: createRefreshToken(user.id),
  };
}

export function refreshSession(refreshToken: string | undefined) {
  if (!refreshToken) {
    throw new AppError(401, 'REFRESH_TOKEN_REQUIRED', 'Missing refresh token.');
  }

  const session = sessions.get(refreshToken);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(refreshToken);
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired.');
  }

  const user = usersById.get(session.userId);
  if (!user) {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid.');
  }

  sessions.delete(refreshToken);
  return {
    ...buildAuthPayload(user),
    refreshToken: createRefreshToken(user.id),
  };
}

export function logoutSession(refreshToken: string | undefined) {
  if (!refreshToken) {
    return;
  }
  sessions.delete(refreshToken);
}

