import { Router } from 'express';

import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  sessionController,
} from './auth.controller.js';
import { requireAuth } from './auth.middleware.js';

export const authRouter = Router();

authRouter.post('/auth/register', registerController);
authRouter.post('/auth/login', loginController);
authRouter.post('/auth/refresh', refreshController);
authRouter.post('/auth/logout', logoutController);
authRouter.get('/auth/session', requireAuth, sessionController);
