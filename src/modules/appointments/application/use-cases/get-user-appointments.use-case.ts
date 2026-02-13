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
import { PaginationUtil } from 'src/modules/shared/util/pagination.util';

@Injectable()
export class GetUserAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: AppointmentRepositoryPort,
  ) {}

  async execute(
    userId: string,
    query?: QueryOptions,
  ): Promise<PaginatedResult<AppointmentEntity>> {
    const { page, limit, offset } = PaginationUtil.getPaginationParams(query);

    const { data, total } = await this.appointmentRepo.findByUserId(userId, {
      ...query,
      offset,
      limit,
    });

    return PaginationUtil.createResult(data, total, page, limit);
  }
}
