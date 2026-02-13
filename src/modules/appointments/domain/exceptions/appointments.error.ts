import { DomainError } from 'src/modules/shared/domain/base.exception';

export const APPOINTMENT_ALREADY_BOOKED_CODE = 'APPOINTMENT_ALREADY_BOOKED';

export class AppointmentAlreadyBookedError extends DomainError {
  readonly code = APPOINTMENT_ALREADY_BOOKED_CODE;

  constructor() {
    super('This appointment slot is already booked.');
  }
}

export const INVALID_APPOINTMENT_TIME_CODE = 'INVALID_APPOINTMENT_TIME';
export class InvalidAppointmentTimeError extends DomainError {
  readonly code = INVALID_APPOINTMENT_TIME_CODE;

  constructor() {
    super('The appointment time is invalid. It must be in the future.');
  }
}
