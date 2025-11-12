import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/)
  password: string;

  @IsInt()
  @IsNotEmpty()
  institutionId: number;
}
