import { DomainErrorMap } from 'src/modules/shared/infrastructure/adapter/http/types/domain-error-map.type';
import {
  ACCESS_DENIED_CODE,
  INVALID_CREDENTIALS_CODE,
  INVALID_REFRESH_TOKEN_CODE,
  REFRESH_TOKEN_NOT_FOUND_CODE,
} from '../../../domain/exceptions/auth.error';
import { UnauthorizedException } from '@nestjs/common';

export const authHttpErrorMap: DomainErrorMap = {
  [INVALID_CREDENTIALS_CODE]: (e) => new UnauthorizedException(e.message),
  [INVALID_REFRESH_TOKEN_CODE]: (e) => new UnauthorizedException(e.message),
  [ACCESS_DENIED_CODE]: (e) => new UnauthorizedException(e.message),
  [REFRESH_TOKEN_NOT_FOUND_CODE]: (e) => new UnauthorizedException(e.message),
};
