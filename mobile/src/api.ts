import type {
  ApiEnvelope,
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../../shared/types/auth.js';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:4000';

async function request<TData>(path: string, init: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiEnvelope<TData> & {
    error?: { code: string; message: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'Request failed.');
  }

  return payload.data;
}

export function registerUser(input: RegisterRequest) {
  return request<AuthResponse>('/auth/register', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function loginUser(input: LoginRequest) {
  return request<AuthResponse>('/auth/login', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function refreshSession(refreshToken: string) {
  return request<AuthResponse>('/auth/refresh', {
    body: JSON.stringify({ refreshToken }),
    method: 'POST',
  });
}

export function loadSession(accessToken: string) {
  return request<{ user: AuthUser }>('/auth/session', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'GET',
  });
}

export function logoutSession(refreshToken: string) {
  return request<{ ok: true }>('/auth/logout', {
    body: JSON.stringify({ refreshToken }),
    method: 'POST',
  });
}
