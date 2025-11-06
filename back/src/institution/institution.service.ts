import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Institution, Prisma } from '@prisma/client';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Institution[]> {
    return this.prisma.institution.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number): Promise<Institution> {
    const institution = await this.prisma.institution.findFirst({
      where: { id, deletedAt: null },
    });
    if (!institution) throw new NotFoundException('Institution not found');
    return institution;
  }

  async create(data: Prisma.InstitutionCreateInput): Promise<Institution> {
    return this.prisma.institution.create({ data });
  }

  async update(
    id: number,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    const institution = await this.prisma.institution.findFirst({
      where: { id, deletedAt: null },
    });
    if (!institution) throw new NotFoundException('Institution not found');
    return this.prisma.institution.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Institution> {
    const institution = await this.prisma.institution.findFirst({
      where: { id, deletedAt: null },
    });
    if (!institution) throw new NotFoundException('Institution not found');
    return this.prisma.institution.update({
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
