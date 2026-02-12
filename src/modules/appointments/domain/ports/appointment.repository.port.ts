import { AppointmentEntity } from '../entities/appointment.entity';
import {
  type PaginatedResult,
  type QueryOptions,
} from 'src/modules/shared/domain/interfaces/query-options.interface';

export const APPOINTMENT_REPOSITORY = 'APPOINTMENT_REPOSITORY';

export interface AppointmentRepositoryPort {
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;
  findByProfessionalIdAndDateRange(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<AppointmentEntity[]>;
  findByUserId(
    userId: string,
    query?: QueryOptions,
  ): Promise<PaginatedResult<AppointmentEntity>>;
}
