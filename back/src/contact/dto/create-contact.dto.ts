import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  institutionName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  approximateClasses: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  callbackRequested: boolean;
}
