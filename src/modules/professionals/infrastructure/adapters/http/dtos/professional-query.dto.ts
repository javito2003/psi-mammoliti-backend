import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/shared/infrastructure/adapter/http/dtos/pagination-query.dto';

export class ProfessionalQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['price', 'createdAt'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  themes?: string;
}
