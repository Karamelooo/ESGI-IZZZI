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
import * as argon2 from 'argon2';

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
    userId: number,
    withDeleted: boolean = false,
  ): Promise<UserPublic | null> {
    const where: any = {
      id: userId,
      ...(withDeleted ? {} : { deletedAt: null }),
    };

    const user = await this.prisma.user.findFirst({
      where,
      select: this.userPublicFields,
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return user;
  }

  async findOneWithPassword(
    userId: number,
    withDeleted: boolean = false,
  ): Promise<User | null> {
    const where: any = {
      id: userId,
      ...(withDeleted ? {} : { deletedAt: null }),
    };

    const user = await this.prisma.user.findFirst({ where });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return user;
  }

  async create(data: CreateUserDto): Promise<UserPublic> {
    console.log('Creating user with data:', data);
    if (await this.prisma.user.findUnique({ where: { email: data.email } }))
      throw new BadRequestException('Email déjà utilisé');

    const hash = await argon2.hash(data.password);

    const user = await this.prisma.user.create({
      data: { ...data, password: hash },
    });
    const { password, ...userPublic } = user;
    console.log('user:', user);
    console.log('userPublic:', userPublic);

    return userPublic;
  }

  async update(userId: number, data: UpdateUserDto): Promise<UserPublic> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: this.userPublicFields,
    });
  }

  async updatePassword(
    userId: number,
    data: UpdatePasswordDto,
  ): Promise<UserPublic> {
    const user = await this.findOneWithPassword(userId);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const isPasswordValid = await argon2.verify(
      user.password,
      data.currentPassword,
    );

    if (!isPasswordValid)
      throw new ForbiddenException('Le mot de passe actuel est incorrect');
    const hash = await argon2.hash(data.newPassword);

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hash },
      select: this.userPublicFields,
    });
  }

  async remove(userId: number): Promise<UserPublic> {
    const user = await this.findOne(userId);
    if (!user)
      throw new NotFoundException('Utilisateur non trouvé ou déjà supprimé');

    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
      select: this.userPublicFields,
    });
  }

  async restore(userId: number): Promise<UserPublic> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: { not: null } },
    });
    if (!user || user.deletedAt === null)
      throw new NotFoundException('Utilisateur non trouvé ou non supprimé');

    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null },
      select: this.userPublicFields,
    });
  }
}
