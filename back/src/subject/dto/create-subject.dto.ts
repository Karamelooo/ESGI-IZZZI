import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty({ message: 'Nom requis' })
  @IsString({ message: 'Nom doit être une chaîne' })
  @MaxLength(50, { message: 'Nom de 50 caractères max' })
  @MinLength(1, { message: 'Nom de 1 caractère min' })
  name: string;

  @IsNotEmpty({ message: 'Nom intervenant requis' })
  @IsString({ message: 'Nom intervenant doit être une chaîne' })
  @MaxLength(50, { message: 'Nom intervenant de 50 caractères max' })
  @MinLength(2, { message: 'Nom intervenant de 2 caractères min' })
  instructorName: string;

  @IsEmail({}, { message: 'Email intervenant invalide' })
  @IsOptional()
  instructorEmail?: string;

  @IsDateString({}, { message: 'Date de début invalide' })
  @IsOptional()
  startDate?: string;

  @IsDateString({}, { message: 'Date de fin invalide' })
  @IsOptional()
  endDate?: string;

  @IsInt({ message: 'ID classe doit être un entier' })
  @IsNotEmpty({ message: 'ID classe requis' })
  classId: number;

  @IsInt({ message: 'ID institution doit être un entier' })
  @IsNotEmpty({ message: 'ID institution requis' })
  institutionId: number;
}
