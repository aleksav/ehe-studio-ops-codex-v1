import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../lib/app-error.js';
import type { ApiError } from '../types/http.js';

export function errorHandler(error: unknown, _req: Request, res: Response<ApiError>, _next: NextFunction) {
  void _next;

  if (error instanceof AppError) {
    return res.status(error.status).json({
      error: {
        code: error.code,
        details: error.details,
        message: error.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong.',
    },
  });
}
