import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class ResponseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResponseDto: CreateResponseDto) {
    const form = await this.prisma.form.findUnique({
      where: { id: createResponseDto.formId },
    });
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    const { answers, ...rest } = createResponseDto;

    return this.prisma.response.create({
      data: {
        ...rest,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            value: { content: answer.value },
          })),
        },
      },
      include: {
        answers: true,
      },
    });
  }

  findAll() {
    return this.prisma.response.findMany({
      include: {
        answers: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.response.findUnique({
      where: { id },
      include: {
        answers: true,
      },
    });
  }
}
