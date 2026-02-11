import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetAvailableSlotsUseCase } from '../../application/use-cases/get-available-slots.use-case';

@Controller('professionals')
export class ProfessionalAppointmentsController {
  constructor(
    private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCase,
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
}
