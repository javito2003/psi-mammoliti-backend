import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { ThemeResponseDto } from '../application/dtos/theme-response.dto';
import { GetThemesUseCase } from '../application/use-cases/get-themes.use-case';

@Controller('themes')
export class ThemesController {
  constructor(private readonly getThemesUseCase: GetThemesUseCase) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll() {
    const themes = await this.getThemesUseCase.execute();
    return themes.map((t) => new ThemeResponseDto(t));
  }
}
