import { ConflictException, NotFoundException } from '@nestjs/common';
import { DomainErrorMap } from 'src/modules/shared/infrastructure/adapter/http/types/domain-error-map.type';
import {
  USER_ALREADY_EXISTS_ERROR_CODE,
  USER_NOT_FOUND_ERROR_CODE,
} from 'src/modules/users/domain/exceptions/users.error';

export const usersHttpErrorMap: DomainErrorMap = {
  [USER_ALREADY_EXISTS_ERROR_CODE]: (e) => new ConflictException(e.message),
  [USER_NOT_FOUND_ERROR_CODE]: (e) => new NotFoundException(e.message),
};
