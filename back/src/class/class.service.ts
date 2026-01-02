import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Class } from '@prisma/client';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    institutionId: number,
    withDeleted: boolean = false,
  ): Promise<Class[]> {
    return this.prisma.class.findMany({
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
  ): Promise<Class | null> {
    const where: any = {
      id,
      institutionId,
      ...(withDeleted ? {} : { deletedAt: null }),
    };
    const classItem = await this.prisma.class.findFirst({ where });
    if (!classItem) throw new NotFoundException('Class not found');
    return classItem;
  }

  async create(institutionId: number, data: CreateClassDto): Promise<Class> {
    return this.prisma.class.create({
      data: {
        ...data,
        institutionId,
      },
    });
  }

  async update(
    id: number,
    institutionId: number,
    data: UpdateClassDto,
  ): Promise<Class> {
    const classItem = await this.findOne(id, institutionId);
    if (!classItem) throw new NotFoundException('Class not found');
    return this.prisma.class.update({ where: { id }, data });
  }

  async remove(id: number, institutionId: number): Promise<Class> {
    const classItem = await this.findOne(id, institutionId);
    if (!classItem) throw new NotFoundException('Class not found');
    return this.prisma.class.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number, institutionId: number): Promise<Class> {
    const classItem = await this.prisma.class.findFirst({
      where: { id, institutionId, deletedAt: { not: null } },
    });
    if (!classItem)
      throw new NotFoundException('Class not found or not deleted');
    return this.prisma.class.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
