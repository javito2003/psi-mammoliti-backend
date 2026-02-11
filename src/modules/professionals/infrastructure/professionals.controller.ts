import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { ProfessionalResponseDto } from '../application/dtos/professional-response.dto';
import { GetProfessionalsUseCase } from '../application/use-cases/get-professionals.use-case';

@Controller('professionals')
export class ProfessionalsController {
  constructor(
    private readonly getProfessionalsUseCase: GetProfessionalsUseCase,
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll() {
    const professionals = await this.getProfessionalsUseCase.execute();
    return professionals.map((p) => new ProfessionalResponseDto(p));
  }
}
