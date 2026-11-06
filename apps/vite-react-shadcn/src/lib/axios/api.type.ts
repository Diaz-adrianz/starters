export type ApiParams = Record<string, string | number | boolean>;

export type ApiResponse<T = undefined> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ApiPaginatedResponse<T> = ApiResponse<{
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}>;
