import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { AppointmentEntity } from '../../../domain/entities/appointment.entity';
import { AppointmentRepositoryPort } from '../../../domain/ports/appointment.repository.port';
import { Appointment } from './appointment.schema';
import { AppointmentMapper } from './appointment.mapper';

@Injectable()
export class OrmAppointmentRepository implements AppointmentRepositoryPort {
  constructor(
    @InjectRepository(Appointment)
    private readonly repository: Repository<Appointment>,
  ) {}

  async save(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    const persistence = AppointmentMapper.toPersistence(appointment);
    const saved = await this.repository.save(persistence);
    return AppointmentMapper.toDomain(saved);
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
    return entities.map((e) => AppointmentMapper.toDomain(e));
  }

  async findByUserId(userId: string): Promise<AppointmentEntity[]> {
    const entities = await this.repository.find({
      where: { userId },
      relations: ['professional', 'professional.user'],
      order: { startAt: 'DESC' },
    });
    return entities.map((e) => AppointmentMapper.toDomain(e));
  }
}
