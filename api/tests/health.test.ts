import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request, Response } from 'express';

import { getHealthController } from '../src/health/health.controller.js';
import type { HealthStatus } from '../src/health/health.service.js';
import type { ApiSuccess } from '../src/types/http.js';

void test('health controller returns service health envelope', () => {
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
  assert.equal(statusCode, 200);
  assert.equal(body.data.service, 'api');
  assert.equal(body.data.status, 'ok');
  assert.equal(typeof body.data.timestamp, 'string');
  assert.equal(typeof body.data.version, 'string');
});
