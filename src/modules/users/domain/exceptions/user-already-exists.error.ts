import { DomainError } from 'src/modules/shared/domain/base.exception';

export const USER_ALREADY_EXISTS_ERROR_CODE = 'USER_ALREADY_EXISTS';

export class UserAlreadyExistsError extends DomainError {
  readonly code = USER_ALREADY_EXISTS_ERROR_CODE;

  constructor() {
    super('User already exists');
  }
}
