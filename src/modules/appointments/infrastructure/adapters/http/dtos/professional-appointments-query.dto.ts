import { IsOptional, IsString } from 'class-validator';

export class ProfessionalAppointmentsQueryDto {
  @IsOptional()
  @IsString()
  weekStart?: string;
}
