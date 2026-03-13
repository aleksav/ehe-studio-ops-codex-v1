import assert from 'node:assert/strict';
import test from 'node:test';

import {
  loginUser,
  refreshSession,
  registerUser,
  logoutSession,
} from '../src/auth/auth.service.js';

void test('auth service registers and logs in a user', async () => {
  const registered = await registerUser({
    email: 'agent@example.com',
    fullName: 'Agent Dev',
    password: 'strongpass123',
  });

  assert.equal(registered.user.email, 'agent@example.com');
  assert.equal(typeof registered.refreshToken, 'string');
  assert.equal(typeof registered.accessToken, 'string');

  const loggedIn = await loginUser({
    email: 'agent@example.com',
    password: 'strongpass123',
  });

  assert.equal(loggedIn.user.id, registered.user.id);
});

void test('auth service rotates refresh sessions and supports logout', async () => {
  const registered = await registerUser({
    email: 'rotate@example.com',
    fullName: 'Rotate User',
    password: 'strongpass123',
  });
  const refreshed = refreshSession(registered.refreshToken);

  assert.notEqual(refreshed.refreshToken, registered.refreshToken);

  logoutSession(refreshed.refreshToken);
  assert.throws(() => refreshSession(refreshed.refreshToken));
});
