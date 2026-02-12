import { BadRequestException } from '@nestjs/common';
import { APPOINTMENT_ALREADY_BOOKED_CODE } from 'src/modules/appointments/domain/exceptions/appointments.error';
import { DomainErrorMap } from 'src/modules/shared/infrastructure/adapter/http/types/domain-error-map.type';

export const appointmentsHttpErrorMap: DomainErrorMap = {
  [APPOINTMENT_ALREADY_BOOKED_CODE]: (e) => new BadRequestException(e.message),
};
