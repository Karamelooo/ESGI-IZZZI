import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubjectDto) {
    return this.prisma.subject.create({ data: dto as any });
  }

  async findAll() {
    return this.prisma.subject.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.subject.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Matière introuvable');
    return item;
  }

  async update(id: string, dto: UpdateSubjectDto) {
    await this.findOne(id);
    return this.prisma.subject.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subject.delete({ where: { id } });
  }
}
