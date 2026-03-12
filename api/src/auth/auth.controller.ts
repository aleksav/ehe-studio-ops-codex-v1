import type { Request, Response } from 'express';

import { loginSchema, registerSchema } from './auth.schema.js';
import {
  getRefreshCookieName,
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
} from './auth.service.js';
import type { ApiSuccess } from '../types/http.js';

type AuthResponse = {
  accessToken: string;
  user: {
    email: string;
    fullName: string;
    id: string;
  };
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: 'strict' as const,
  secure: true,
};

export async function registerController(req: Request, res: Response<ApiSuccess<AuthResponse>>) {
  const payload = registerSchema.parse(req.body);
  const result = await registerUser(payload);

  res.cookie(getRefreshCookieName(), result.refreshToken, REFRESH_COOKIE_OPTIONS);
  return res.status(201).json({
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
}

export async function loginController(req: Request, res: Response<ApiSuccess<AuthResponse>>) {
  const payload = loginSchema.parse(req.body);
  const result = await loginUser(payload);

  res.cookie(getRefreshCookieName(), result.refreshToken, REFRESH_COOKIE_OPTIONS);
  return res.status(200).json({
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
}

export function refreshController(req: Request, res: Response<ApiSuccess<AuthResponse>>) {
  const result = refreshSession(req.cookies?.[getRefreshCookieName()] as string | undefined);

  res.cookie(getRefreshCookieName(), result.refreshToken, REFRESH_COOKIE_OPTIONS);
  return res.status(200).json({
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
}

export function logoutController(req: Request, res: Response<ApiSuccess<{ ok: true }>>) {
  logoutSession(req.cookies?.[getRefreshCookieName()] as string | undefined);
  res.clearCookie(getRefreshCookieName(), REFRESH_COOKIE_OPTIONS);
  return res.status(200).json({ data: { ok: true } });
}

