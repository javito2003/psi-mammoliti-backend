import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PASSWORD_HASHER,
  type PasswordHasherPort,
} from '../../../users/domain/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../users/domain/ports/user.repository.port';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findById(payload.sub);

      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const isRefreshTokenMatching = await this.passwordHasher.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Access Denied');
      }

      // Rotate tokens
      const newPayload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      const hashedRefreshToken = await this.passwordHasher.hash(newRefreshToken);
      await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

      return { accessToken, newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }
}
