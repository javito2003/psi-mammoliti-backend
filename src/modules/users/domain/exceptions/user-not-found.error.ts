import { DomainError } from 'src/modules/shared/domain/base.exception';

export const USER_NOT_FOUND_ERROR_CODE = 'USER_NOT_FOUND';

export class UserNotFoundError extends DomainError {
  readonly code = USER_NOT_FOUND_ERROR_CODE;

  constructor(userId: string) {
    super('User not found', { userId });
  }
}
