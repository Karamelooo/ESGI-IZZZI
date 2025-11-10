import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Institution } from '@prisma/client';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Institution[]> {
    return this.prisma.institution.findMany({
      where: { deletedAt: null },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number): Promise<Institution | null> {
    return this.prisma.institution.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: CreateInstitutionDto): Promise<Institution> {
    return this.prisma.institution.create({ data });
  }

  async update(id: number, data: UpdateInstitutionDto): Promise<Institution> {
    const institution = await this.findOne(id);
    if (!institution) throw new NotFoundException('Institution not found');
    return this.prisma.institution.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<void> {
    const institution = await this.findOne(id);
    if (!institution) throw new NotFoundException('Institution not found');
    await this.prisma.institution.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number): Promise<Institution> {
    const institution = await this.prisma.institution.findFirst({
      where: { id, deletedAt: { not: null } },
    });
    if (!institution)
      throw new NotFoundException('Institution not found or not deleted');
    return this.prisma.institution.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
