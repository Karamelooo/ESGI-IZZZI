import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subject } from '@prisma/client';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    institutionId: number,
    withDeleted: boolean = false,
  ): Promise<any> {
    const subjects = await this.prisma.subject.findMany({
      where: {
        institutionId,
        ...(withDeleted ? {} : { deletedAt: null }),
      },
      include: {
        class: {
          include: {
            institution: true,
          },
        },
        forms: {
          include: {
            _count: {
              select: { responses: true },
            },
            responses: {
              select: { globalRating: true },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    return subjects.map((subject) => ({
      ...subject,
      forms: subject.forms.map((form) => {
        const totalRating = form.responses.reduce(
          (sum, r) => sum + r.globalRating,
          0,
        );
        const averageRating =
          form.responses.length > 0 ? totalRating / form.responses.length : 0;
        const { responses, ...formRest } = form;
        return {
          ...formRest,
          averageRating,
        };
      }),
    }));
  }

  async findAllByClassId(
    classId: number,
    institutionId: number,
    withDeleted: boolean = false,
  ): Promise<any> {
    const subjects = await this.prisma.subject.findMany({
      where: {
        classId,
        institutionId,
        ...(withDeleted ? {} : { deletedAt: null }),
      },
      include: {
        class: {
          include: {
            institution: true,
          },
        },
        forms: {
          include: {
            _count: {
              select: { responses: true },
            },
            responses: {
              select: { globalRating: true },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    return subjects.map((subject) => ({
      ...subject,
      forms: subject.forms.map((form) => {
        const totalRating = form.responses.reduce(
          (sum, r) => sum + r.globalRating,
          0,
        );
        const averageRating =
          form.responses.length > 0 ? totalRating / form.responses.length : 0;
        const { responses, ...formRest } = form;
        return {
          ...formRest,
          averageRating,
        };
      }),
    }));
  }

  async findOne(
    id: number,
    institutionId: number,
    withDeleted: boolean = false,
  ): Promise<Subject | null> {
    const where: any = {
      id,
      institutionId,
      ...(withDeleted ? {} : { deletedAt: null }),
    };
    const subject = await this.prisma.subject.findFirst({ where });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async create(
    institutionId: number,
    data: CreateSubjectDto,
  ): Promise<Subject> {
    return this.prisma.subject.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        institutionId,
      },
    });
  }

  async createMany(
    institutionId: number,
    items: CreateSubjectDto[],
  ): Promise<{ count: number }> {
    const data = items.map((item) => ({
      ...item,
      startDate: item.startDate ? new Date(item.startDate) : undefined,
      endDate: item.endDate ? new Date(item.endDate) : undefined,
      institutionId,
    }));

    return this.prisma.subject.createMany({
      data,
    });
  }

  async update(
    id: number,
    institutionId: number,
    data: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne(id, institutionId);
    if (!subject) throw new NotFoundException('Subject not found');
    return this.prisma.subject.update({ where: { id }, data });
  }

  async remove(id: number, institutionId: number): Promise<Subject> {
    const subject = await this.findOne(id, institutionId);
    if (!subject) throw new NotFoundException('Subject not found');
    return this.prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number, institutionId: number): Promise<Subject> {
    const subject = await this.prisma.subject.findFirst({
      where: { id, institutionId, deletedAt: { not: null } },
    });
    if (!subject)
      throw new NotFoundException('Subject not found or not deleted');
    return this.prisma.subject.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
