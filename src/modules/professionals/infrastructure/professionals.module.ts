import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROFESSIONAL_REPOSITORY } from '../domain/ports/professional.repository.port';
import { OrmProfessionalRepository } from './adapters/persistence/orm-professional.repository';
import { Professional } from './adapters/persistence/professional.schema';
import { ProfessionalAvailability } from './adapters/persistence/professional-availability.schema';
import { ProfessionalsController } from './professionals.controller';
import { GetProfessionalsUseCase } from '../application/use-cases/get-professionals.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Professional, ProfessionalAvailability])],
  controllers: [ProfessionalsController],
  providers: [
    GetProfessionalsUseCase,
    {
      provide: PROFESSIONAL_REPOSITORY,
      useClass: OrmProfessionalRepository,
    },
  ],
  exports: [PROFESSIONAL_REPOSITORY],
})
export class ProfessionalsModule {}
