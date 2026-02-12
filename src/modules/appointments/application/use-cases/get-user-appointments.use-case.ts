import { Inject, Injectable } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepositoryPort,
} from '../../domain/ports/appointment.repository.port';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';
import {
  type PaginatedResult,
  type QueryOptions,
} from 'src/modules/shared/domain/interfaces/query-options.interface';

@Injectable()
export class GetUserAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: AppointmentRepositoryPort,
  ) {}

  execute(
    userId: string,
    query?: QueryOptions,
  ): Promise<PaginatedResult<AppointmentEntity>> {
    return this.appointmentRepo.findByUserId(userId, query);
  }
}
