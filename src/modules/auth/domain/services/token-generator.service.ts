import { type PasswordHasherPort } from '../../../users/domain/ports/password-hasher.port';
import { type UserRepositoryPort } from '../../../users/domain/ports/user.repository.port';
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
    const accessToken = this.tokenGenerator.sign(payload, 900); // 15 minutes in seconds
    const refreshToken = this.tokenGenerator.sign(payload, 604800); // 7 days in seconds

    const hashedRefreshToken = await this.passwordHasher.hash(refreshToken);
    await this.userRepository.updateRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
