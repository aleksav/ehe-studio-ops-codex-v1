import { Router } from 'express';

import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/auth/register', registerController);
authRouter.post('/auth/login', loginController);
authRouter.post('/auth/refresh', refreshController);
authRouter.post('/auth/logout', logoutController);

