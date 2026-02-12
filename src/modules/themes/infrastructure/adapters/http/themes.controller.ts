import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { GetThemesUseCase } from 'src/modules/themes/application/use-cases/get-themes.use-case';
import { ThemeResponseDto } from './dtos/theme-response.dto';

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
