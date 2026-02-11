import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThemeEntity } from '../../../domain/entities/theme.entity';
import { ThemeRepositoryPort } from '../../../domain/ports/theme.repository.port';
import { Theme } from './theme.schema';

@Injectable()
export class OrmThemeRepository implements ThemeRepositoryPort {
  constructor(
    @InjectRepository(Theme)
    private readonly repository: Repository<Theme>,
  ) {}

  async save(theme: ThemeEntity): Promise<ThemeEntity> {
    const entity = this.repository.create(theme);
    const saved = await this.repository.save(entity);
    return new ThemeEntity(saved);
  }

  async findAll(): Promise<ThemeEntity[]> {
    const entities = await this.repository.find();
    return entities.map((e) => new ThemeEntity(e));
  }
}
