import {
  MinLength,
  MaxLength,
  IsEmail,
  IsInt,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsInt()
  institutionId?: number;
}
