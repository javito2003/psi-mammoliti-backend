import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APPOINTMENT_REPOSITORY } from '../domain/ports/appointment.repository.port';
import { OrmAppointmentRepository } from './adapters/persistence/orm-appointment.repository';
import { Appointment } from './adapters/persistence/appointment.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: OrmAppointmentRepository,
    },
  ],
  exports: [APPOINTMENT_REPOSITORY],
})
export class AppointmentsModule {}
