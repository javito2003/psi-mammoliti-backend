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
import { ProfessionalAppointmentsQueryDto } from './dtos/professional-appointments-query.dto';
import { ProfessionalValidatorDto } from 'src/modules/professionals/infrastructure/adapters/http/dtos/professional-validator.dto';
import { CreateProfessionalAppointmentBodyDto } from './dtos/professional-appointments-body.dto';

@Controller('professionals')
export class ProfessionalAppointmentsController {
  constructor(
    private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCase,
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
  ) {}

  @Get(':professionalId/appointments/availability')
  async getAvailability(
    @Param() param: ProfessionalValidatorDto,
    @Query() query: ProfessionalAppointmentsQueryDto,
  ) {
    const slots = await this.getAvailableSlotsUseCase.execute(
      param.professionalId,
      query.weekStart,
    );
    return { slots };
  }

  @Post(':professionalId/appointments')
  @UseGuards(JwtAuthGuard)
  async createAppointment(
    @Param() param: ProfessionalValidatorDto,
    @Body() body: CreateProfessionalAppointmentBodyDto,
    @UserId() userId: string,
  ) {
    return this.createAppointmentUseCase.execute(
      param.professionalId,
      userId,
      body.startAt,
    );
  }
}
