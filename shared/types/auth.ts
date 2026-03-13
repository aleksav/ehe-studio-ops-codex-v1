export type AuthUser = {
  email: string;
  fullName: string;
  id: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  fullName: string;
};

export type ApiEnvelope<TData> = {
  data: TData;
  meta?: {
    warning?: string;
  };
};
