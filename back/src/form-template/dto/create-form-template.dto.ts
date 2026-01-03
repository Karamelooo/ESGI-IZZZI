import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuestionType } from '@prisma/client';

export class CreateTemplateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  label: string;

  @IsInt()
  order: number;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsArray()
  @IsOptional()
  options?: any;

  @IsInt()
  @IsOptional()
  groupId?: number;
}

export class CreateTemplateQuestionGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  order: number;
}

export class CreateFormTemplateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemplateQuestionGroupDto)
  @IsOptional()
  groups?: CreateTemplateQuestionGroupDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemplateQuestionDto)
  questions: CreateTemplateQuestionDto[];
}
