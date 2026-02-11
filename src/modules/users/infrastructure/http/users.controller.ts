import {
  Controller,
  Get,
  Req,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';

@Controller('users')
export class UsersController {
  constructor(private readonly getUserProfileUseCase: GetUserProfileUseCase) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@Req() request: Request) {
    const userId = request.user!.userId;
    return this.getUserProfileUseCase.execute(userId);
  }
}
