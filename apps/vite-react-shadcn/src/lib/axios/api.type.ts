export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ApiPaginatedResponse<T> = ApiResponse<{
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}> & {
  items: T[];
};
