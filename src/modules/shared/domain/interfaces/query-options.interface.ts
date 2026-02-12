export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface QueryOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
