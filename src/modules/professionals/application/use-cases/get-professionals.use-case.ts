import { Inject, Injectable } from '@nestjs/common';
import { ProfessionalEntity } from '../../domain/entities/professional.entity';
import {
  PROFESSIONAL_REPOSITORY,
  type ProfessionalRepositoryPort,
} from '../../domain/ports/professional.repository.port';

@Injectable()
export class GetProfessionalsUseCase {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly repository: ProfessionalRepositoryPort,
  ) {}

  async execute(themeSlug?: string): Promise<ProfessionalEntity[]> {
    return this.repository.findAll(themeSlug);
  }
}
