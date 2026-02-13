import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetUserAppointmentsUseCase } from '../../../application/use-cases/get-user-appointments.use-case';
import { JwtAuthGuard } from '../../../../auth/infrastructure/guards/jwt-auth.guard';
import { UserId } from 'src/modules/shared/infrastructure/decorators/user-id.decorator';
import { AppointmentQueryDto } from './dtos/appointment-query.dto';
import { PaginatedResponseDto } from 'src/modules/shared/infrastructure/adapter/http/dtos/paginated-response.dto';

@Controller('appointments')
export class UserAppointmentsController {
  constructor(
    private readonly getUserAppointmentsUseCase: GetUserAppointmentsUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyAppointments(
    @Query() query: AppointmentQueryDto,
    @UserId() userId: string,
  ) {
    const result = await this.getUserAppointmentsUseCase.execute(userId, query);
    return PaginatedResponseDto.from(result, (a) => a);
  }
}
