import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { FormStatus } from '@prisma/client';

export class UpdateFormDto {
  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus;

  @IsInt()
  @IsOptional()
  templateId?: number;

  @IsString()
  @IsOptional()
  aiSynthesis?: string;
}
