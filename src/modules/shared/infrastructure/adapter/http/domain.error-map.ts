import { usersHttpErrorMap } from 'src/modules/users/infrastructure/adapters/http/users.error-map';

export const domainHttpErrorMap = {
  ...usersHttpErrorMap,
} as const;
