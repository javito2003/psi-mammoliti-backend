import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PASSWORD_HASHER,
  type PasswordHasherPort,
} from '../../../users/domain/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../users/domain/ports/user.repository.port';
import { LoginUserDto } from '../dtos/login-user.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    dto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await this.passwordHasher.hash(refreshToken);
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
