import { AppointmentEntity } from '../entities/appointment.entity';
import {
  type RepositoryFindOptions,
  type RepositoryFindResult,
} from 'src/modules/shared/domain/interfaces/repository-options.interface';

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
    query: RepositoryFindOptions,
  ): Promise<RepositoryFindResult<AppointmentEntity>>;
}
