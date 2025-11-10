import { MinLength, MaxLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/)
  newPassword: string;

  @MinLength(8)
  @MaxLength(128)
  currentPassword: string;
}
