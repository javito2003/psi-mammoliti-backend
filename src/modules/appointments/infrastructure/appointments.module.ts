import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APPOINTMENT_REPOSITORY } from '../domain/ports/appointment.repository.port';
import { OrmAppointmentRepository } from './adapters/persistence/orm-appointment.repository';
import { Appointment } from './adapters/persistence/appointment.schema';
import { ProfessionalsModule } from '../../professionals/infrastructure/professionals.module';
import { ProfessionalAppointmentsController } from './http/professional-appointments.controller';
import { UserAppointmentsController } from './http/user-appointments.controller';
import { GetAvailableSlotsUseCase } from '../application/use-cases/get-available-slots.use-case';
import { CreateAppointmentUseCase } from '../application/use-cases/create-appointment.use-case';
import { GetUserAppointmentsUseCase } from '../application/use-cases/get-user-appointments.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), ProfessionalsModule],
  controllers: [ProfessionalAppointmentsController, UserAppointmentsController],
  providers: [
    GetAvailableSlotsUseCase,
    CreateAppointmentUseCase,
    GetUserAppointmentsUseCase,
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: OrmAppointmentRepository,
    },
  ],
  exports: [APPOINTMENT_REPOSITORY],
})
export class AppointmentsModule {}
