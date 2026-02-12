import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/shared/infrastructure/adapter/http/dtos/pagination-query.dto';

export class AppointmentQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['startAt', 'status', 'createdAt'])
  sortBy: string = 'startAt';
}
