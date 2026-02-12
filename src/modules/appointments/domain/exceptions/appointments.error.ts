import { DomainError } from 'src/modules/shared/domain/base.exception';

export const APPOINTMENT_ALREADY_BOOKED_CODE = 'APPOINTMENT_ALREADY_BOOKED';

export class AppointmentAlreadyBookedError extends DomainError {
  readonly code = APPOINTMENT_ALREADY_BOOKED_CODE;

  constructor() {
    super('This appointment slot is already booked.');
  }
}
