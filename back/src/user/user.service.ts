import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserPublic } from './dto/user-public.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  userPublicFields = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    institutionId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  };

  constructor(private prisma: PrismaService) {}

  async findAll(withDeleted: boolean = false): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      where: withDeleted ? undefined : { deletedAt: null },
      orderBy: { id: 'asc' },
      select: this.userPublicFields,
    });
  }

  async findOne(
    id: number,
    withDeleted: boolean = false,
  ): Promise<UserPublic | null> {
    const where: any = { id };
    if (!withDeleted) where.deletedAt = null;

    const user = await this.prisma.user.findUnique({
      where,
      select: this.userPublicFields,
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return user;
  }

  async findOneWithPassword(
    id: number,
    withDeleted: boolean = false,
  ): Promise<User | null> {
    const where: any = { id };
    if (!withDeleted) where.deletedAt = null;

    const user = await this.prisma.user.findUnique({ where });
    if (!user || (!withDeleted && user.deletedAt !== null))
      throw new NotFoundException('Utilisateur non trouvé');

    return user;
  }

  async create(data: CreateUserDto): Promise<UserPublic> {
    if (await this.prisma.user.findUnique({ where: { email: data.email } }))
      throw new BadRequestException('Email déjà utilisé');

    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hash },
    });
    const { password, ...userPublic } = user;

    return userPublic;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserPublic> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.userPublicFields,
    });
  }

  async updatePassword(
    id: number,
    data: UpdatePasswordDto,
  ): Promise<UserPublic> {
    const user = await this.findOneWithPassword(id);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );
    if (!isPasswordValid)
      throw new ForbiddenException('Le mot de passe actuel est incorrect');

    const hash = await bcrypt.hash(data.newPassword, 10);

    return this.prisma.user.update({
      where: { id },
      data: { password: hash },
      select: this.userPublicFields,
    });
  }

  async remove(id: number): Promise<UserPublic> {
    const user = await this.findOne(id);
    if (!user)
      throw new NotFoundException('Utilisateur non trouvé ou déjà supprimé');

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: this.userPublicFields,
    });
  }

  async restore(id: number): Promise<UserPublic> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: { not: null } },
    });
    if (!user || user.deletedAt === null)
      throw new NotFoundException('Utilisateur non trouvé ou non supprimé');

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
      select: this.userPublicFields,
    });
  }
}
