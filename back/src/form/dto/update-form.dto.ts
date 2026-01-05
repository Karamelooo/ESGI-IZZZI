import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { FormStatus } from '@prisma/client';

export class UpdateFormDto {
  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus;

  @IsInt()
  @IsOptional()
  templateId?: number;
}
