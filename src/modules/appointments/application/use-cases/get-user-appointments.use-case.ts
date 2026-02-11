import { Inject, Injectable } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepositoryPort,
} from '../../domain/ports/appointment.repository.port';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';

@Injectable()
export class GetUserAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: AppointmentRepositoryPort,
  ) {}

  execute(userId: string): Promise<AppointmentEntity[]> {
    return this.appointmentRepo.findByUserId(userId);
  }
}
