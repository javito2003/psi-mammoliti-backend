import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalEntity } from '../../../domain/entities/professional.entity';
import { ProfessionalRepositoryPort } from '../../../domain/ports/professional.repository.port';
import { Professional } from './professional.schema';
import { ProfessionalMapper } from './professional.mapper';

@Injectable()
export class OrmProfessionalRepository implements ProfessionalRepositoryPort {
  constructor(
    @InjectRepository(Professional)
    private readonly repository: Repository<Professional>,
  ) {}

  async save(professional: ProfessionalEntity): Promise<ProfessionalEntity> {
    const persistence = ProfessionalMapper.toPersistence(professional);
    const saved = await this.repository.save(persistence);
    return ProfessionalMapper.toDomain(saved);
  }

  async findAll(): Promise<ProfessionalEntity[]> {
    const entities = await this.repository.find({
      relations: ['user', 'themes', 'availability'],
    });
    return entities.map((e) => ProfessionalMapper.toDomain(e));
  }

  async findById(id: string): Promise<ProfessionalEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user', 'themes', 'availability'],
    });
    return entity ? ProfessionalMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<ProfessionalEntity | null> {
    const entity = await this.repository.findOne({
      where: { userId },
      relations: ['user', 'themes', 'availability'],
    });
    return entity ? ProfessionalMapper.toDomain(entity) : null;
  }
}
