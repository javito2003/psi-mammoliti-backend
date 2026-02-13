import {
  PaginatedResult,
  QueryOptions,
} from '../domain/interfaces/query-options.interface';

export class PaginationUtil {
  static getPaginationParams(query?: QueryOptions): {
    page: number;
    limit: number;
    offset: number;
  } {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 50;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  static createResult<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResult<T> {
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
