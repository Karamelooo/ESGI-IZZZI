import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateInstitutionDto {
  @IsString()
  @MaxLength(255)
  name?: string;
}
