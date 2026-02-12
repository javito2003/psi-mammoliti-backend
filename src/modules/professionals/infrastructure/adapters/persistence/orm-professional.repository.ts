import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalEntity } from '../../../domain/entities/professional.entity';
import { ProfessionalRepositoryPort } from '../../../domain/ports/professional.repository.port';
import { ProfessionalFilter } from '../../../domain/interfaces/professional-filter.interface';
import {
  type PaginatedResult,
  type QueryOptions,
} from 'src/modules/shared/domain/interfaces/query-options.interface';
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
    filter?: ProfessionalFilter,
    query?: QueryOptions,
  ): Promise<PaginatedResult<ProfessionalEntity>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sortBy = query?.sortBy ?? 'createdAt';
    const sortOrder = query?.sortOrder ?? 'DESC';

    const qb = this.repository
      .createQueryBuilder('professional')
      .leftJoinAndSelect('professional.user', 'user')
      .leftJoinAndSelect('professional.themes', 'themes')
      .leftJoinAndSelect('professional.availability', 'availability');

    if (filter?.themeSlug) {
      qb.innerJoin(
        'professional.themes',
        'filterTheme',
        'filterTheme.slug = :slug',
        { slug: filter.themeSlug },
      );
    }

    qb.orderBy(`professional.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      data: entities.map((e) => ProfessionalMapper.toDomain(e)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
