export class PaginationDto<T = undefined> {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
