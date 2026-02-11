import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APPOINTMENT_REPOSITORY } from '../domain/ports/appointment.repository.port';
import { OrmAppointmentRepository } from './adapters/persistence/orm-appointment.repository';
import { Appointment } from './adapters/persistence/appointment.schema';
import { ProfessionalsModule } from '../../professionals/infrastructure/professionals.module';
import { ProfessionalAppointmentsController } from './professional-appointments.controller';
import { GetAvailableSlotsUseCase } from '../application/use-cases/get-available-slots.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), ProfessionalsModule],
  controllers: [ProfessionalAppointmentsController],
  providers: [
    GetAvailableSlotsUseCase,
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: OrmAppointmentRepository,
    },
  ],
  exports: [APPOINTMENT_REPOSITORY],
})
export class AppointmentsModule {}
