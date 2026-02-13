import { IsISO8601, IsOptional } from 'class-validator';

export class ProfessionalAppointmentsQueryDto {
  @IsOptional()
  @IsISO8601()
  weekStart?: string;
}
