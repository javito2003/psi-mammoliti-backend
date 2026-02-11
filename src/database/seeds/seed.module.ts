import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../modules/shared/infrastructure/database/database.module';
import { ThemesModule } from '../../modules/themes/infrastructure/themes.module';
import { UsersModule } from '../../modules/users/infrastructure/users.module';
import { ProfessionalsModule } from '../../modules/professionals/infrastructure/professionals.module';
import { SeedService } from './seed.service';
import databaseConfig from '../../modules/shared/infrastructure/database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    ThemesModule,
    UsersModule,
    ProfessionalsModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
