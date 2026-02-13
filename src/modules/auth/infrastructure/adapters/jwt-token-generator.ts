import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenGeneratorPort } from '../../domain/ports/token-generator.port';

@Injectable()
export class JwtTokenGenerator implements TokenGeneratorPort {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: Record<string, unknown>, expiresIn: number): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  verify<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }
}
