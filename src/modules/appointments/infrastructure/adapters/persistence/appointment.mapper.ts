import { AppointmentEntity } from 'src/modules/appointments/domain/entities/appointment.entity';
import { Appointment } from './appointment.schema';

export class AppointmentMapper {
  static toDomain(schema: Appointment): AppointmentEntity {
    return {
      id: schema.id,
      professionalId: schema.professionalId,
      userId: schema.userId,
      startAt: schema.startAt,
      endAt: schema.endAt,
      status: schema.status,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      professionalFirstName: schema.professional?.user?.firstName,
      professionalLastName: schema.professional?.user?.lastName,
    };
  }

  static toPersistence(domain: AppointmentEntity): Appointment {
    const schema = new Appointment();
    schema.id = domain.id;
    schema.professionalId = domain.professionalId;
    schema.userId = domain.userId;
    schema.startAt = domain.startAt;
    schema.endAt = domain.endAt;
    schema.status = domain.status;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}
