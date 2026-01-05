import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInstitutionDto {
  @IsNotEmpty({ message: 'Nom requis' })
  @IsString({ message: 'Nom doit être une chaîne' })
  @MaxLength(50, { message: 'Nom de 50 caractères max' })
  @MinLength(1, { message: 'Nom de 1 caractère min' })
  name: string;
}
