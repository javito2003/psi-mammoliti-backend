import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUserAppointmentsUseCase } from '../../application/use-cases/get-user-appointments.use-case';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import type { Request } from 'express';
import { UserId } from 'src/modules/shared/infrastructure/decorators/user-id.decorator';

@Controller('appointments')
export class UserAppointmentsController {
  constructor(
    private readonly getUserAppointmentsUseCase: GetUserAppointmentsUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyAppointments(@UserId() userId: string) {
    return this.getUserAppointmentsUseCase.execute(userId);
  }
}
