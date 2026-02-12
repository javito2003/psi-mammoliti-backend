import { ProfessionalEntity } from '../entities/professional.entity';

export const PROFESSIONAL_REPOSITORY = 'PROFESSIONAL_REPOSITORY';

export interface ProfessionalRepositoryPort {
  save(professional: ProfessionalEntity): Promise<ProfessionalEntity>;
  findAll(themeSlug?: string): Promise<ProfessionalEntity[]>;
  findById(id: string): Promise<ProfessionalEntity | null>;
  findByUserId(userId: string): Promise<ProfessionalEntity | null>;
}
