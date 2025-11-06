import {
  IsOptional,
  IsString,
  MaxLength,
  IsEmail,
  MinLength,
  IsInt,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsInt()
  institutionId?: number;
}
