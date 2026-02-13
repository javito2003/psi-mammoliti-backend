import { Controller, Get, Query } from '@nestjs/common';
import { GetProfessionalsUseCase } from 'src/modules/professionals/application/use-cases/get-professionals.use-case';
import { ProfessionalResponseDto } from './dtos/professional-response.dto';
import { ProfessionalQueryDto } from './dtos/professional-query.dto';
import { PaginatedResponseDto } from 'src/modules/shared/infrastructure/adapter/http/dtos/paginated-response.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(
    private readonly getProfessionalsUseCase: GetProfessionalsUseCase,
  ) {}

  @Get()
  async getAll(@Query() query: ProfessionalQueryDto) {
    const { themes, ...pagination } = query;
    const filter = themes
      ? { themeSlugs: themes.split(',').map((s) => s.trim()) }
      : undefined;
    const result = await this.getProfessionalsUseCase.execute(
      filter,
      pagination,
    );
    return PaginatedResponseDto.from(
      result,
      (p) => new ProfessionalResponseDto(p),
    );
  }
}
