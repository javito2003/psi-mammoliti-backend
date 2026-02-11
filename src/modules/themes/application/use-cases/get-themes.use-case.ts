import { Inject, Injectable } from '@nestjs/common';
import { ThemeEntity } from '../../domain/entities/theme.entity';
import {
  THEME_REPOSITORY,
  type ThemeRepositoryPort,
} from '../../domain/ports/theme.repository.port';

@Injectable()
export class GetThemesUseCase {
  constructor(
    @Inject(THEME_REPOSITORY)
    private readonly repository: ThemeRepositoryPort,
  ) {}

  async execute(): Promise<ThemeEntity[]> {
    return this.repository.findAll();
  }
}
