export class PaginationResponseDto<T = undefined> {
  page?: number;
  limit?: number;
  totalItems: number;
  totalPages?: number;
  items: T[];

  constructor(items: T[], totalItems: number, page?: number, limit?: number) {
    this.items = items;
    this.totalItems = totalItems;
    this.page = page;
    this.limit = limit;
    this.totalPages = limit ? Math.ceil(totalItems / limit) || 1 : undefined;
  }
}
