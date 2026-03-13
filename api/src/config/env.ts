const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_DAYS = 7;

export const env = {
  accessTokenSecret: process.env.JWT_SECRET ?? 'dev-only-jwt-secret-change-me',
  accessTokenTtl: ACCESS_TOKEN_TTL,
  isProduction: process.env.NODE_ENV === 'production',
  webOrigin: process.env.WEB_ORIGIN ?? 'http://127.0.0.1:4173',
  refreshTokenTtlDays: REFRESH_TOKEN_TTL_DAYS,
} as const;
