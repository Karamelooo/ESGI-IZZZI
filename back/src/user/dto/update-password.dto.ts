import { MinLength, MaxLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/, {
    message: 'Nouveau mot de passe alphanumérique',
  })
  @MaxLength(128, { message: 'Nouveau mot de passe de 128 caractères max' })
  @MinLength(8, { message: 'Nouveau mot de passe de 8 caractères min' })
  newPassword: string;

  @MaxLength(128, { message: 'Mot de passe actuel de 128 caractères max' })
  @MinLength(8, { message: 'Mot de passe actuel de 8 caractères min' })
  currentPassword: string;
}
