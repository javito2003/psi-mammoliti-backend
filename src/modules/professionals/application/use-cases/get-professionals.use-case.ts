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
    return this.repository.findAll(filter, query);
  }
}
