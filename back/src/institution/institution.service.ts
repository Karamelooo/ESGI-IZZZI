import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Institution } from '@prisma/client';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) {}

  async findAll(withDeleted: boolean = false): Promise<Institution[]> {
    return this.prisma.institution.findMany({
      where: withDeleted ? undefined : { deletedAt: null },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(
    id: number,
    withDeleted: boolean = false,
  ): Promise<Institution | null> {
    const where: any = { id };
    if (!withDeleted) where.deletedAt = null;

    const institution = await this.prisma.institution.findUnique({ where });
    if (!institution) throw new NotFoundException('Établissement non trouvé');

    return institution;
  }

  async create(data: CreateInstitutionDto): Promise<Institution> {
    return this.prisma.institution.create({ data });
  }

  async update(id: number, data: UpdateInstitutionDto): Promise<Institution> {
    const institution = await this.findOne(id);
    if (!institution) throw new NotFoundException('Établissement non trouvé');

    return this.prisma.institution.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Institution> {
    const institution = await this.findOne(id);
    if (!institution) throw new NotFoundException('Établissement non trouvé');

    return this.prisma.institution.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number): Promise<Institution> {
    const institution = await this.prisma.institution.findUnique({
      where: { id, deletedAt: { not: null } },
    });
    if (!institution)
      throw new NotFoundException('Établissement non trouvé ou non supprimé');

    return this.prisma.institution.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
