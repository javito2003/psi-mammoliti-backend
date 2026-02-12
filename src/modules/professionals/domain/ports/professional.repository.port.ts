import { ProfessionalEntity } from '../entities/professional.entity';
import { ProfessionalFilter } from '../interfaces/professional-filter.interface';
import {
  type PaginatedResult,
  type QueryOptions,
} from 'src/modules/shared/domain/interfaces/query-options.interface';

export const PROFESSIONAL_REPOSITORY = 'PROFESSIONAL_REPOSITORY';

export interface ProfessionalRepositoryPort {
  save(professional: ProfessionalEntity): Promise<ProfessionalEntity>;
  findAll(
    filter?: ProfessionalFilter,
    query?: QueryOptions,
  ): Promise<PaginatedResult<ProfessionalEntity>>;
  findById(id: string): Promise<ProfessionalEntity | null>;
  findByUserId(userId: string): Promise<ProfessionalEntity | null>;
}
