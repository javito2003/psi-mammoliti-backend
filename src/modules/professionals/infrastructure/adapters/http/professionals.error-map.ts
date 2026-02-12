import { NotFoundException } from '@nestjs/common';
import { PROFESSIONAL_NOT_FOUND_CODE } from 'src/modules/professionals/domain/exceptions/professionals.error';
import { DomainErrorMap } from 'src/modules/shared/infrastructure/adapter/http/types/domain-error-map.type';

export const professionalsHttpErrorMap: DomainErrorMap = {
  [PROFESSIONAL_NOT_FOUND_CODE]: (e) => new NotFoundException(e.message),
};
