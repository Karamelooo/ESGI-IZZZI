import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassesDto } from './dto/create-classes.dto';
import { UpdateClassesDto } from './dto/update-classes.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClassesDto) {
    return this.prisma.class.create({ data: dto as any });
  }

  async findAll() {
    return this.prisma.class.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.class.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Classe introuvable');
    return item;
  }

  async update(id: string, dto: UpdateClassesDto) {
    await this.findOne(id);
    return this.prisma.class.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.class.delete({ where: { id } });
  }
}
