import {
  Controller,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UserId } from 'src/modules/shared/infrastructure/decorators/user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly getUserProfileUseCase: GetUserProfileUseCase) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@UserId() userId: string) {
    console.log('Getting profile for user ID:', userId);
    return this.getUserProfileUseCase.execute(userId);
  }
}
