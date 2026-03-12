export type ApiMeta = {
  page?: number;
  pageSize?: number;
  total?: number;
  warning?: string;
};

export type ApiSuccess<T> = {
  data: T;
  meta?: ApiMeta;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

