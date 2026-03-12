import cookieParser from 'cookie-parser';
import express from 'express';

import { authRouter } from './auth/auth.routes.js';
import { healthRouter } from './health/health.routes.js';
import { errorHandler } from './middleware/error-handler.js';

export function createApp() {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(healthRouter);
  app.use(authRouter);
  app.use(errorHandler);

  return app;
}
