import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { COOKIE_NAME } from './auth.constants';
import { LoginUserDto } from '../application/dtos/login-user.dto';
import { RegisterUserDto } from '../application/dtos/register-user.dto';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { RefreshAccessTokenUseCase } from '../application/use-cases/refresh-access-token.use-case';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    private readonly configService: ConfigService,
  ) {}

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const NODE_ENV = this.configService.get<string>('NODE_ENV');
    response.cookie(COOKIE_NAME.ACCESS, accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 60 * 1000, // 1 minute
    });

    response.cookie(COOKIE_NAME.REFRESH, refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.loginUserUseCase.execute(dto);

    this.setAuthCookies(response, accessToken, refreshToken);

    return { message: 'Login successful' };
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.[COOKIE_NAME.REFRESH] as
      | string
      | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken, newRefreshToken } =
      await this.refreshAccessTokenUseCase.execute(refreshToken);

    this.setAuthCookies(response, accessToken, newRefreshToken);

    return { message: 'Token refreshed' };
  }
}
