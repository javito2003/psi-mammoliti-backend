import {
  ConflictException,
  NotFoundException,
  type HttpException,
} from '@nestjs/common';
import { USER_ALREADY_EXISTS_ERROR_CODE } from 'src/modules/users/domain/exceptions/user-already-exists.error';
import { USER_NOT_FOUND_ERROR_CODE } from 'src/modules/users/domain/exceptions/user-not-found.error';

export const usersHttpErrorMap: Record<string, (e: Error) => HttpException> = {
  [USER_ALREADY_EXISTS_ERROR_CODE]: (e) => new ConflictException(e.message),
  [USER_NOT_FOUND_ERROR_CODE]: (e) => new NotFoundException(e.message),
};
