import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFormDto: CreateFormDto) {
    const existing = await this.prisma.form.findUnique({
      where: {
        subjectId_type: {
          subjectId: createFormDto.subjectId,
          type: createFormDto.type,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Form of type ${createFormDto.type} already exists for subject ${createFormDto.subjectId}`,
      );
    }

    return this.prisma.form.create({
      data: createFormDto,
      include: {
        template: true,
      },
    });
  }

  findAll() {
    return this.prisma.form.findMany({
      include: {
        template: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.form.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            questions: {
              orderBy: {
                order: 'asc',
              },
            },
            questionGroups: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });
  }

  update(id: number, updateFormDto: UpdateFormDto) {
    return this.prisma.form.update({
      where: { id },
      data: updateFormDto,
    });
  }

  remove(id: number) {
    return this.prisma.form.delete({
      where: { id },
    });
  }
}
