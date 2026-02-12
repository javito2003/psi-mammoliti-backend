import { Inject, Injectable } from '@nestjs/common';
import {
  PASSWORD_HASHER,
  type PasswordHasherPort,
} from '../../../users/domain/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../users/domain/ports/user.repository.port';
import {
  AccessDeniedError,
  InvalidRefreshTokenError,
} from '../../domain/exceptions/auth.error';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import {
  TOKEN_GENERATOR,
  type TokenGeneratorPort,
} from '../../domain/ports/token-generator.port';
import { TokenGenerator } from '../../domain/services/token-generator.service';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGeneratorPort: TokenGeneratorPort,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    let payload: JwtPayload;

    try {
      payload = await this.tokenGeneratorPort.verify<JwtPayload>(refreshToken);
    } catch {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.hashedRefreshToken) {
      throw new AccessDeniedError();
    }

    const isRefreshTokenMatching = await this.passwordHasher.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new AccessDeniedError();
    }

    const tokens = await this.tokenGenerator.generate(user.id, user.email);

    return {
      accessToken: tokens.accessToken,
      newRefreshToken: tokens.refreshToken,
    };
  }
}
