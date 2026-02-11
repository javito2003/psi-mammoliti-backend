import { ThemeEntity } from '../entities/theme.entity';

export const THEME_REPOSITORY = 'THEME_REPOSITORY';

export interface ThemeRepositoryPort {
  save(theme: ThemeEntity): Promise<ThemeEntity>;
  findAll(): Promise<ThemeEntity[]>;
}
