import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { COOKIE_NAME } from '../auth.constants';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/refresh-access-token.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserId } from 'src/modules/shared/infrastructure/decorators/user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
  ) {}

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie(COOKIE_NAME.ACCESS, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie(COOKIE_NAME.REFRESH, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh',
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

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @UserId() userId: string,
  ) {
    await this.logoutUserUseCase.execute(userId);

    response.clearCookie(COOKIE_NAME.ACCESS);
    response.clearCookie(COOKIE_NAME.REFRESH, { path: '/auth/refresh' });

    return { message: 'Logout successful' };
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
