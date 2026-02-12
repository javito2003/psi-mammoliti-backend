import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalEntity } from '../../../domain/entities/professional.entity';
import { ProfessionalRepositoryPort } from '../../../domain/ports/professional.repository.port';
import { ProfessionalFilter } from '../../../domain/interfaces/professional-filter.interface';
import {
  type RepositoryFindOptions,
  type RepositoryFindResult,
} from 'src/modules/shared/domain/interfaces/repository-options.interface';
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

  async findAll(
    filter: ProfessionalFilter,
    query: RepositoryFindOptions,
  ): Promise<RepositoryFindResult<ProfessionalEntity>> {
    const { offset, limit, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const qb = this.repository
      .createQueryBuilder('professional')
      .leftJoinAndSelect('professional.user', 'user')
      .leftJoinAndSelect('professional.themes', 'themes')
      .leftJoinAndSelect('professional.availability', 'availability');

    if (filter.themeSlug) {
      qb.innerJoin(
        'professional.themes',
        'filterTheme',
        'filterTheme.slug = :slug',
        { slug: filter.themeSlug },
      );
    }

    qb.orderBy(`professional.${sortBy}`, sortOrder).skip(offset).take(limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      data: entities.map((e) => ProfessionalMapper.toDomain(e)),
      total,
    };
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
