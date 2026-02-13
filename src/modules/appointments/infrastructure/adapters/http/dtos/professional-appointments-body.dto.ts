import { IsISO8601 } from 'class-validator';

export class CreateProfessionalAppointmentBodyDto {
  @IsISO8601()
  startAt: string;
}
