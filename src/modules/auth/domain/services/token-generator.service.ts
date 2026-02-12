import { type PasswordHasherPort } from '../../../users/domain/ports/password-hasher.port';
import { type UserRepositoryPort } from '../../../users/domain/ports/user.repository.port';
import {
  ACCESS_TOKEN_EXPIRATION_MINUTES,
  REFRESH_TOKEN_EXPIRATION_DAYS,
} from '../constants/token.constant';
import { type TokenGeneratorPort } from '../ports/token-generator.port';

export class TokenGenerator {
  constructor(
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async generate(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };
    const accessToken = this.tokenGenerator.sign(
      payload,
      ACCESS_TOKEN_EXPIRATION_MINUTES * 60,
    ); // 15 minutes in seconds
    const refreshToken = this.tokenGenerator.sign(
      payload,
      REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60,
    ); // 7 days in seconds

    const hashedRefreshToken = await this.passwordHasher.hash(refreshToken);
    await this.userRepository.updateRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
