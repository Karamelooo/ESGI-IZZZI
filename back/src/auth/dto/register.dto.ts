import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsInt()
  institutionId: number;
}
