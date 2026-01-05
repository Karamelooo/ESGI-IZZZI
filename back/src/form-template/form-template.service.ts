import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';

@Injectable()
export class FormTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFormTemplateDto: CreateFormTemplateDto) {
    const { groups, questions, ...rest } = createFormTemplateDto;

    return this.prisma.formTemplate.create({
      data: {
        ...rest,
        questionGroups: {
          create: groups,
        },
        questions: {
          create: questions,
        },
      },
      include: {
        questions: true,
        questionGroups: true,
      },
    });
  }

  findAll() {
    return this.prisma.formTemplate.findMany({
      include: {
        questions: true,
        questionGroups: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.formTemplate.findUnique({
      where: { id },
      include: {
        questions: true,
        questionGroups: true,
      },
    });
  }

  update(id: number, updateFormTemplateDto: UpdateFormTemplateDto) {
    const { groups, questions, ...rest } = updateFormTemplateDto;
    return this.prisma.formTemplate.update({
      where: { id },
      data: {
        ...rest,
      },
    });
  }

  remove(id: number) {
    return this.prisma.formTemplate.delete({
      where: { id },
    });
  }
}
