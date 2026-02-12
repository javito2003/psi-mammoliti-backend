import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GetProfessionalsUseCase } from 'src/modules/professionals/application/use-cases/get-professionals.use-case';
import { ProfessionalResponseDto } from './dtos/professional-response.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(
    private readonly getProfessionalsUseCase: GetProfessionalsUseCase,
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll(@Query('theme') theme?: string) {
    const professionals = await this.getProfessionalsUseCase.execute(theme);
    return professionals.map((p) => new ProfessionalResponseDto(p));
  }
}
