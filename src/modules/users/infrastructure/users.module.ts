import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from '../domain/ports/user.repository.port';
import { UserCreator } from '../domain/services/user-creator.service';
import { OrmUserRepository } from './adapters/persistence/orm-user.repository';
import { User } from './adapters/persistence/user.schema';
import { PASSWORD_HASHER } from '../domain/ports/password-hasher.port';
import { BcryptPasswordHasher } from './adapters/bcrypt-password-hasher';
import { UsersController } from './http/users.controller';
import { GetUserProfileUseCase } from '../application/use-cases/get-user-profile.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UserCreator,
    GetUserProfileUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: OrmUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [USER_REPOSITORY, UserCreator, PASSWORD_HASHER],
})
export class UsersModule {}
