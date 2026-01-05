import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty({ message: 'Nom requis' })
  @IsString({ message: 'Nom doit être une chaîne' })
  @MaxLength(50, { message: 'Nom de 50 caractères max' })
  @MinLength(1, { message: 'Nom de 1 caractère min' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description doit être une chaîne' })
  @MaxLength(500, { message: 'Description de 500 caractères max' })
  description?: string;

  @IsInt({ message: "Nombre d'étudiants doit être un entier" })
  @Max(1000, { message: "Nombre d'étudiants 1000 max" })
  @Min(0, { message: "Nombre d'étudiants positif" })
  studentCount: number;

  @IsNotEmpty({ message: 'Emails étudiants requis' })
  @IsString({ message: 'Emails étudiants doit être une chaîne' })
  studentEmails: string;
}
