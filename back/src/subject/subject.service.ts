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
  ): Promise<Subject[]> {
    return this.prisma.subject.findMany({
      where: {
        institutionId,
        ...(withDeleted ? {} : { deletedAt: null }),
      },
      orderBy: { id: 'asc' },
    });
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
        institutionId,
      },
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
