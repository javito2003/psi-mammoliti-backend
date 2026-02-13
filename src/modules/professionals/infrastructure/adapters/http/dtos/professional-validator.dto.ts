import { IsString } from 'class-validator';

export class ProfessionalValidatorDto {
  @IsString()
  professionalId: string;
}
