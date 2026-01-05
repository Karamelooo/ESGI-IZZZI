import { IsEnum, IsInt } from 'class-validator';
import { FormType } from '@prisma/client';

export class CreateFormDto {
  @IsEnum(FormType)
  type: FormType;

  @IsInt()
  subjectId: number;

  @IsInt()
  templateId: number;
}
