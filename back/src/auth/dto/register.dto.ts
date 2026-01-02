import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: "Nom d'école requis" })
  @MaxLength(10, { message: "Nom d'école de 100 caractères max" })
  @MinLength(2, { message: "Nom d'école de 1 caractère min" })
  institutionName: string;

  @IsNotEmpty({ message: 'Prénom requis' })
  @MaxLength(50, { message: 'Prénom de 50 caractères max' })
  @MinLength(1, { message: 'Prénom de 1 caractère min' })
  firstName: string;

  @IsNotEmpty({ message: 'Nom requis' })
  @MaxLength(50, { message: 'Nom de 50 caractères max' })
  @MinLength(1, { message: 'Nom de 1 caractère min' })
  lastName: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  @MaxLength(255, { message: 'Email de 255 caractères max' })
  email: string;

  @IsNotEmpty({ message: 'Mot de passe requis' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/, {
    message: 'Mot de passe alphanumérique',
  })
  @MaxLength(128, { message: 'Mot de passe de 128 caractères max' })
  @MinLength(8, { message: 'Mot de passe de 8 caractères min' })
  password: string;
}
