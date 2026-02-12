export interface RepositoryFindOptions {
  offset: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface RepositoryFindResult<T> {
  data: T[];
  total: number;
}
