import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  value: any;

  @IsInt()
  responseId: number;

  @IsInt()
  questionId: number;
}

export class CreateResponseDto {
  @IsEmail()
  studentEmail: string;

  @IsInt()
  globalRating: number;

  @IsInt()
  formId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
