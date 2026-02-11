import { AppointmentEntity } from '../entities/appointment.entity';

export const APPOINTMENT_REPOSITORY = 'APPOINTMENT_REPOSITORY';

export interface AppointmentRepositoryPort {
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;
  findByProfessionalIdAndDateRange(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<AppointmentEntity[]>;
}
