import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepositoryPort,
} from '../../domain/ports/appointment.repository.port';
import {
  PROFESSIONAL_REPOSITORY,
  type ProfessionalRepositoryPort,
} from '../../../professionals/domain/ports/professional.repository.port';
import {
  AppointmentEntity,
  AppointmentStatus,
} from '../../domain/entities/appointment.entity';
import { APPOINTMENT_DURATION_HOURS } from '../../domain/constants/availability-block.constants';
import { ProfessionalNotFoundError } from 'src/modules/professionals/domain/exceptions/professionals.error';
import {
  AppointmentAlreadyBookedError,
  InvalidAppointmentTimeError,
} from '../../domain/exceptions/appointments.error';
import { isValidAppointment } from '../../domain/service/is-valid-appointment';
import { setTime } from 'src/modules/shared/util/date.util';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: AppointmentRepositoryPort,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepo: ProfessionalRepositoryPort,
  ) {}

  async execute(
    professionalId: string,
    userId: string,
    startAt: string,
  ): Promise<AppointmentEntity> {
    const professional = await this.professionalRepo.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError(professionalId);
    }

    const startAtDate = new Date(startAt);
    const startDate = setTime(startAtDate, startAtDate.getHours());
    if (!isValidAppointment(startDate, professional.availability)) {
      throw new InvalidAppointmentTimeError();
    }

    const endDate = setTime(
      startDate,
      startDate.getHours() + APPOINTMENT_DURATION_HOURS,
    );

    const overlapping =
      await this.appointmentRepo.findByProfessionalIdAndDateRange(
        professionalId,
        startDate,
        endDate,
      );

    if (overlapping.length > 0) {
      throw new AppointmentAlreadyBookedError();
    }

    const now = new Date();
    const appointment: AppointmentEntity = {
      id: uuidv4(),
      professionalId,
      userId,
      startAt: startDate,
      endAt: endDate,
      status: AppointmentStatus.CONFIRMED,
      createdAt: now,
      updatedAt: now,
    };

    return this.appointmentRepo.save(appointment);
  }
}
