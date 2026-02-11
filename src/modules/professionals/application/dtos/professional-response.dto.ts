import { Exclude, Expose, Type } from 'class-transformer';
import { ProfessionalEntity } from '../../domain/entities/professional.entity';

@Exclude()
class ThemeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

@Exclude()
export class ProfessionalResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  bio: string;

  @Expose()
  price: number;

  @Expose()
  timezone: string;

  @Expose()
  @Type(() => ThemeDto)
  themes: ThemeDto[];

  constructor(professional: ProfessionalEntity) {
    this.id = professional.id;
    this.firstName = professional.user?.firstName || '';
    this.lastName = professional.user?.lastName || '';
    this.bio = professional.bio;
    this.price = professional.price;
    this.timezone = professional.timezone;
    this.themes =
      professional.themes?.map((t) => ({ id: t.id, name: t.name })) || [];
  }
}
