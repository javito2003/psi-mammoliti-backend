import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../users/infrastructure/users.module';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { RefreshAccessTokenUseCase } from '../application/use-cases/refresh-access-token.use-case';
import { LogoutUserUseCase } from '../application/use-cases/logout-user.use-case';
import { AuthController } from './http/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TOKEN_GENERATOR } from '../domain/ports/token-generator.port';
import { JwtTokenGenerator } from './adapters/jwt-token-generator';
import { TokenGenerator } from '../domain/services/token-generator.service';
import { type TokenGeneratorPort } from '../domain/ports/token-generator.port';
import {
  PASSWORD_HASHER,
  type PasswordHasherPort,
} from '../../users/domain/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../users/domain/ports/user.repository.port';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secretKey',
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshAccessTokenUseCase,
    LogoutUserUseCase,
    JwtStrategy,
    {
      provide: TOKEN_GENERATOR,
      useClass: JwtTokenGenerator,
    },
    {
      provide: TokenGenerator,
      useFactory: (
        tokenGenerator: TokenGeneratorPort,
        passwordHasher: PasswordHasherPort,
        userRepository: UserRepositoryPort,
      ) => new TokenGenerator(tokenGenerator, passwordHasher, userRepository),
      inject: [TOKEN_GENERATOR, PASSWORD_HASHER, USER_REPOSITORY],
    },
  ],
})
export class AuthModule {}
