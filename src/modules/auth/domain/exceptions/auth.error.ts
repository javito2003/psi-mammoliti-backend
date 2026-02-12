import { DomainError } from 'src/modules/shared/domain/base.exception';

export const INVALID_CREDENTIALS_CODE = 'INVALID_CREDENTIALS';

export class InvalidCredentialsError extends DomainError {
  readonly code = INVALID_CREDENTIALS_CODE;

  constructor() {
    super('Invalid email or password.');
  }
}

export const INVALID_REFRESH_TOKEN_CODE = 'INVALID_REFRESH_TOKEN';

export class InvalidRefreshTokenError extends DomainError {
  readonly code = INVALID_REFRESH_TOKEN_CODE;

  constructor() {
    super('The provided refresh token is invalid or has expired.');
  }
}

export const ACCESS_DENIED_CODE = 'ACCESS_DENIED';

export class AccessDeniedError extends DomainError {
  readonly code = ACCESS_DENIED_CODE;

  constructor() {
    super('Access denied. Please log in to continue.');
  }
}

export const REFRESH_TOKEN_NOT_FOUND_CODE = 'REFRESH_TOKEN_NOT_FOUND';

export class RefreshTokenNotFoundError extends DomainError {
  readonly code = REFRESH_TOKEN_NOT_FOUND_CODE;

  constructor() {
    super('No refresh token found. Please log in again.');
  }
}
