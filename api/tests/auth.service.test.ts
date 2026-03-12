import { describe, expect, it } from 'vitest';

import {
  loginUser,
  refreshSession,
  registerUser,
  logoutSession,
} from '../src/auth/auth.service.js';

describe('auth service', () => {
  it('registers and logs in a user', async () => {
    const registered = await registerUser({
      email: 'agent@example.com',
      fullName: 'Agent Dev',
      password: 'strongpass123',
    });

    expect(registered.user.email).toBe('agent@example.com');
    expect(typeof registered.refreshToken).toBe('string');
    expect(typeof registered.accessToken).toBe('string');

    const loggedIn = await loginUser({
      email: 'agent@example.com',
      password: 'strongpass123',
    });
    expect(loggedIn.user.id).toBe(registered.user.id);
  });

  it('rotates refresh sessions and supports logout', async () => {
    const registered = await registerUser({
      email: 'rotate@example.com',
      fullName: 'Rotate User',
      password: 'strongpass123',
    });
    const refreshed = refreshSession(registered.refreshToken);

    expect(refreshed.refreshToken).not.toBe(registered.refreshToken);

    logoutSession(refreshed.refreshToken);
    expect(() => refreshSession(refreshed.refreshToken)).toThrowError();
  });
});

