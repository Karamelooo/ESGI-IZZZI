import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
  IsInt,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Prénom requis' })
  @MinLength(1, { message: 'Prénom de 1 caractère min' })
  @MaxLength(50, { message: 'Prénom de 50 caractères max' })
  firstName: string;

  @IsNotEmpty({ message: 'Nom requis' })
  @MinLength(1, { message: 'Nom de 1 caractère min' })
  @MaxLength(50, { message: 'Nom de 50 caractères max' })
  lastName: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  @MaxLength(255, { message: 'Email de 255 caractères max' })
  email: string;

  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(8, { message: 'Mot de passe de 8 caractères min' })
  @MaxLength(128, { message: 'Mot de passe de 128 caractères max' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/, {
    message: 'Mot de passe alphanumérique',
  })
  password: string;

  @IsInt()
  @IsNotEmpty()
  institutionId: number;
}
