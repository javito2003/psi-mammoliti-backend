import { DomainError } from 'src/modules/shared/domain/base.exception';

export const PROFESSIONAL_NOT_FOUND_CODE = 'PROFESSIONAL_NOT_FOUND';

export class ProfessionalNotFoundError extends DomainError {
  readonly code = PROFESSIONAL_NOT_FOUND_CODE;

  constructor(professionalId: string) {
    super('Professional not found', { professionalId });
  }
}
