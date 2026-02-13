import { Inject, Injectable } from '@nestjs/common';
import { ProfessionalEntity } from '../../domain/entities/professional.entity';
import {
  PROFESSIONAL_REPOSITORY,
  type ProfessionalRepositoryPort,
} from '../../domain/ports/professional.repository.port';
import { type ProfessionalFilter } from '../../domain/interfaces/professional-filter.interface';
import {
  type PaginatedResult,
  type QueryOptions,
} from 'src/modules/shared/domain/interfaces/query-options.interface';
import { PaginationUtil } from 'src/modules/shared/util/pagination.util';

@Injectable()
export class GetProfessionalsUseCase {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly repository: ProfessionalRepositoryPort,
  ) {}

  async execute(
    filter?: ProfessionalFilter,
    query?: QueryOptions,
  ): Promise<PaginatedResult<ProfessionalEntity>> {
    const { page, limit, offset } = PaginationUtil.getPaginationParams(query);

    const { data, total } = await this.repository.findAll(filter ?? {}, {
      ...query,
      offset,
      limit,
    });

    return PaginationUtil.createResult(data, total, page, limit);
  }
}
