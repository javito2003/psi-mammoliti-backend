import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { THEME_REPOSITORY } from '../domain/ports/theme.repository.port';
import { GetThemesUseCase } from '../application/use-cases/get-themes.use-case';
import { OrmThemeRepository } from './adapters/persistence/orm-theme.repository';
import { Theme } from './adapters/persistence/theme.schema';
import { ThemesController } from './themes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Theme])],
  controllers: [ThemesController],
  providers: [
    GetThemesUseCase,
    {
      provide: THEME_REPOSITORY,
      useClass: OrmThemeRepository,
    },
  ],
  exports: [THEME_REPOSITORY],
})
export class ThemesModule {}
