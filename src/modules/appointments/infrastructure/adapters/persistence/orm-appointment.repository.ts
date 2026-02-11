import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { AppointmentEntity } from '../../../domain/entities/appointment.entity';
import { AppointmentRepositoryPort } from '../../../domain/ports/appointment.repository.port';
import { Appointment } from './appointment.schema';

@Injectable()
export class OrmAppointmentRepository implements AppointmentRepositoryPort {
  constructor(
    @InjectRepository(Appointment)
    private readonly repository: Repository<Appointment>,
  ) {}

  async save(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    const persistence = this.toPersistence(appointment);
    const saved = await this.repository.save(persistence);
    return this.toDomain(saved);
  }

  async findByProfessionalIdAndDateRange(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<AppointmentEntity[]> {
    const entities = await this.repository.find({
      where: {
        professionalId,
        startAt: Between(start, end),
      },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findByUserId(userId: string): Promise<AppointmentEntity[]> {
    const entities = await this.repository.find({
      where: { userId },
      relations: ['professional', 'professional.user'],
      order: { startAt: 'DESC' },
    });
    return entities.map((e) => this.toDomain(e));
  }

  private toDomain(schema: Appointment): AppointmentEntity {
    return new AppointmentEntity({
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
    });
  }

  private toPersistence(domain: AppointmentEntity): Appointment {
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
