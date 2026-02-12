import { SortOrder } from './query-options.interface';

export interface RepositoryFindOptions {
  offset: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface RepositoryFindResult<T> {
  data: T[];
  total: number;
}
