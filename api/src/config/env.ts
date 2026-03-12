const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_DAYS = 7;

export const env = {
  accessTokenSecret: process.env.JWT_SECRET ?? 'dev-only-jwt-secret-change-me',
  accessTokenTtl: ACCESS_TOKEN_TTL,
  refreshTokenTtlDays: REFRESH_TOKEN_TTL_DAYS,
} as const;

