import { Exclude, Expose } from 'class-transformer';
import type { ThemeEntity } from '../../../../domain/entities/theme.entity';

@Exclude()
export class ThemeResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  constructor(theme: ThemeEntity) {
    Object.assign(this, theme);
  }
}
