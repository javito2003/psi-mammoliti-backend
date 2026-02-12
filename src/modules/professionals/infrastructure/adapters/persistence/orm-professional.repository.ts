import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalEntity } from '../../../domain/entities/professional.entity';
import { ThemeEntity } from '../../../../themes/domain/entities/theme.entity';
import { ProfessionalRepositoryPort } from '../../../domain/ports/professional.repository.port';
import { Professional } from './professional.schema';
import { Theme } from '../../../../themes/infrastructure/adapters/persistence/theme.schema';

import { ProfessionalAvailabilityEntity } from '../../../domain/entities/professional-availability.entity';
import { ProfessionalAvailability } from './professional-availability.schema';

@Injectable()
export class OrmProfessionalRepository implements ProfessionalRepositoryPort {
  constructor(
    @InjectRepository(Professional)
    private readonly repository: Repository<Professional>,
  ) {}

  async save(professional: ProfessionalEntity): Promise<ProfessionalEntity> {
    const persistence = this.toPersistence(professional);
    const saved = await this.repository.save(persistence);
    return this.toDomain(saved);
  }

  async findAll(): Promise<ProfessionalEntity[]> {
    const entities = await this.repository.find({
      relations: ['user', 'themes', 'availability'],
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: string): Promise<ProfessionalEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user', 'themes', 'availability'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<ProfessionalEntity | null> {
    const entity = await this.repository.findOne({
      where: { userId },
      relations: ['user', 'themes', 'availability'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(schema: Professional): ProfessionalEntity {
    return new ProfessionalEntity({
      id: schema.id,
      userId: schema.userId,
      user: schema.user
        ? {
            id: schema.user.id,
            firstName: schema.user.firstName,
            lastName: schema.user.lastName,
            email: schema.user.email,
            createdAt: schema.user.createdAt,
            updatedAt: schema.user.updatedAt,
          }
        : undefined,
      bio: schema.bio,
      price: Number(schema.price),
      timezone: schema.timezone,
      themes: schema.themes?.map(
        (t) => new ThemeEntity({ id: t.id, name: t.name, slug: t.slug }),
      ),
      availability: schema.availability?.map(
        (a) =>
          new ProfessionalAvailabilityEntity({
            id: a.id,
            professionalId: a.professionalId,
            dayOfWeek: a.dayOfWeek,
            block: a.block,
          }),
      ),
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  private toPersistence(domain: ProfessionalEntity): Professional {
    const schema = new Professional();
    schema.id = domain.id;
    schema.userId = domain.userId;
    schema.bio = domain.bio;
    schema.price = domain.price;
    schema.timezone = domain.timezone;
    schema.themes = domain.themes?.map((t) => {
      const theme = new Theme();
      theme.id = t.id;
      return theme;
    });
    schema.availability = domain.availability?.map((a) => {
      const av = new ProfessionalAvailability();
      av.id = a.id;
      av.professionalId = domain.id; // Ensure link
      av.dayOfWeek = a.dayOfWeek;
      av.block = a.block;
      av.createdAt = a.createdAt;
      av.updatedAt = a.updatedAt;
      return av;
    });
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}
