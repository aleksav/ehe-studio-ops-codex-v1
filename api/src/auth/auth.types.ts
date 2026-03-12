export type AuthUser = {
  email: string;
  fullName: string;
  id: string;
  passwordHash: string;
};

export type SessionRecord = {
  expiresAt: number;
  userId: string;
};

export type AuthTokenPayload = {
  email: string;
  fullName: string;
  sub: string;
};

