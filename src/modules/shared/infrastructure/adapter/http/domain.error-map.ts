import { appointmentsHttpErrorMap } from 'src/modules/appointments/infrastructure/adapters/http/appointments.error-map';
import { authHttpErrorMap } from 'src/modules/auth/infrastructure/adapters/http/auth.error-map';
import { professionalsHttpErrorMap } from 'src/modules/professionals/infrastructure/adapters/http/professionals.error-map';
import { usersHttpErrorMap } from 'src/modules/users/infrastructure/adapters/http/users.error-map';

export const domainHttpErrorMap = {
  ...usersHttpErrorMap,
  ...professionalsHttpErrorMap,
  ...authHttpErrorMap,
  ...appointmentsHttpErrorMap,
} as const;
