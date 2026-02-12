import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetAvailableSlotsUseCase } from '../../../application/use-cases/get-available-slots.use-case';
import { CreateAppointmentUseCase } from '../../../application/use-cases/create-appointment.use-case';
import { JwtAuthGuard } from '../../../../auth/infrastructure/guards/jwt-auth.guard';
import { UserId } from 'src/modules/shared/infrastructure/decorators/user-id.decorator';

@Controller('professionals')
export class ProfessionalAppointmentsController {
  constructor(
    private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCase,
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
  ) {}

  @Get(':professionalId/appointments/availability')
  async getAvailability(
    @Param('professionalId') professionalId: string,
    @Query('weekStart') weekStart?: string,
  ) {
    const slots = await this.getAvailableSlotsUseCase.execute(
      professionalId,
      weekStart,
    );
    return { slots };
  }

  @Post(':professionalId/appointments')
  @UseGuards(JwtAuthGuard)
  async createAppointment(
    @Param('professionalId') professionalId: string,
    @Body() body: { startAt: string },
    @UserId() userId: string,
  ) {
    return this.createAppointmentUseCase.execute(
      professionalId,
      userId,
      body.startAt,
    );
  }
}
