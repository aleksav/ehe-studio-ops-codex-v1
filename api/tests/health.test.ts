import { describe, expect, it } from 'vitest';
import type { Request, Response } from 'express';

import { getHealthController } from '../src/health/health.controller.js';
import type { HealthStatus } from '../src/health/health.service.js';
import type { ApiSuccess } from '../src/types/http.js';

describe('health controller', () => {
  it('returns service health envelope', () => {
    let payload: unknown;
    let statusCode = 0;
    const res = {
      json(body: unknown) {
        payload = body;
        return this;
      },
      status(code: number) {
        statusCode = code;
        return this;
      },
    } as unknown as Response<ApiSuccess<HealthStatus>>;

    getHealthController({} as Request, res);

    const body = payload as { data: Record<string, unknown> };
    expect(statusCode).toBe(200);
    expect(body.data.service).toBe('api');
    expect(body.data.status).toBe('ok');
    expect(typeof body.data.timestamp).toBe('string');
    expect(typeof body.data.version).toBe('string');
  });
});
