import type { Request, Response } from 'express';

import { loginSchema, registerSchema } from './auth.schema.js';
import {
  getUserById,
  getRefreshCookieName,
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
} from './auth.service.js';
import type { AuthenticatedRequest } from './auth.middleware.js';
import type { AuthSuccessPayload } from './auth.types.js';
import type { ApiSuccess } from '../types/http.js';
import { AppError } from '../lib/app-error.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};
const CLEAR_REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export async function registerController(req: Request, res: Response<ApiSuccess<AuthSuccessPayload>>) {
  const payload = registerSchema.parse(req.body);
  const result = await registerUser(payload);

  res.cookie(getRefreshCookieName(), result.refreshToken, REFRESH_COOKIE_OPTIONS);
  return res.status(201).json({ data: result });
}

export async function loginController(req: Request, res: Response<ApiSuccess<AuthSuccessPayload>>) {
  const payload = loginSchema.parse(req.body);
  const result = await loginUser(payload);

  res.cookie(getRefreshCookieName(), result.refreshToken, REFRESH_COOKIE_OPTIONS);
  return res.status(200).json({ data: result });
}

export function refreshController(req: Request, res: Response<ApiSuccess<AuthSuccessPayload>>) {
  const body = req.body as { refreshToken?: string } | undefined;
  const result = refreshSession(
    body?.refreshToken ?? (req.cookies?.[getRefreshCookieName()] as string | undefined),
  );

  res.cookie(getRefreshCookieName(), result.refreshToken, REFRESH_COOKIE_OPTIONS);
  return res.status(200).json({ data: result });
}

export function logoutController(req: Request, res: Response<ApiSuccess<{ ok: true }>>) {
  const body = req.body as { refreshToken?: string } | undefined;
  logoutSession(body?.refreshToken ?? (req.cookies?.[getRefreshCookieName()] as string | undefined));
  res.clearCookie(getRefreshCookieName(), CLEAR_REFRESH_COOKIE_OPTIONS);
  return res.status(200).json({ data: { ok: true } });
}

export function sessionController(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<{ user: AuthSuccessPayload['user'] }>>,
) {
  const userId = req.auth?.sub;
  if (!userId) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Missing authenticated user.');
  }

  const user = getUserById(userId);
  if (!user) {
    throw new AppError(401, 'INVALID_ACCESS_TOKEN', 'Authenticated user no longer exists.');
  }

  return res.status(200).json({
    data: {
      user: {
        email: user.email,
        fullName: user.fullName,
        id: user.id,
      },
    },
  });
}
