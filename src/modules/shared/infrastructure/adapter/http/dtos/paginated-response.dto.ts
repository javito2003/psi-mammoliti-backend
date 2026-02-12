import { PaginatedResult } from 'src/modules/shared/domain/interfaces/query-options.interface';

export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  static from<E, D>(
    result: PaginatedResult<E>,
    mapFn: (entity: E) => D,
  ): PaginatedResponseDto<D> {
    const dto = new PaginatedResponseDto<D>();
    dto.data = result.data.map(mapFn);
    dto.meta = {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
    return dto;
  }
}
