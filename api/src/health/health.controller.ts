import type { Request, Response } from 'express';

import { getHealthStatus } from './health.service.js';
import type { ApiSuccess } from '../types/http.js';

export function getHealthController(_req: Request, res: Response<ApiSuccess<ReturnType<typeof getHealthStatus>>>) {
  return res.status(200).json({
    data: getHealthStatus(),
  });
}

