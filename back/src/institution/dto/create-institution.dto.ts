import { IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateInstitutionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
