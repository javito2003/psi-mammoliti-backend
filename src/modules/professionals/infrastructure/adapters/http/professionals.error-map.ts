import { HttpException, NotFoundException } from '@nestjs/common';
import { PROFESSIONAL_NOT_FOUND_CODE } from 'src/modules/professionals/domain/exceptions/professional-not-found.error';

export const professionalsHttpErrorMap: Record<
  string,
  (e: Error) => HttpException
> = {
  [PROFESSIONAL_NOT_FOUND_CODE]: (e) => new NotFoundException(e.message),
};
