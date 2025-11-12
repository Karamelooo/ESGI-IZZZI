import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateInstitutionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  name?: string;
}
