import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/infrastructure/users.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { ProfessionalsModule } from './modules/professionals/infrastructure/professionals.module';
import { ThemesModule } from './modules/themes/infrastructure/themes.module';
import { AppointmentsModule } from './modules/appointments/infrastructure/appointments.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/shared/infrastructure/database/database.module';
import databaseConfig from './modules/shared/infrastructure/database/database.config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfessionalsModule,
    ThemesModule,
    AppointmentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
