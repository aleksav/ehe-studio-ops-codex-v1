import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../lib/app-error.js';
import type { AuthTokenPayload } from './auth.types.js';

export type AuthenticatedRequest = Request & {
  auth?: AuthTokenPayload;
};

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError(401, 'AUTH_REQUIRED', 'Missing bearer token.'));
  }

  try {
    const token = header.slice('Bearer '.length);
    req.auth = jwt.verify(token, env.accessTokenSecret) as AuthTokenPayload;
    return next();
  } catch {
    return next(new AppError(401, 'INVALID_ACCESS_TOKEN', 'Access token is invalid or expired.'));
  }
}
