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
    id: number,
    withDeleted: boolean = false,
  ): Promise<UserPublic | null> {
    const where: any = { id, ...(withDeleted ? {} : { deletedAt: null }) };
    const user = await this.prisma.user.findFirst({
      where,
      select: this.userPublicFields,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneWithPassword(
    id: number,
    withDeleted: boolean = false,
  ): Promise<User | null> {
    const where: any = { id, ...(withDeleted ? {} : { deletedAt: null }) };
    const user = await this.prisma.user.findFirst({ where });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: CreateUserDto): Promise<UserPublic> {
    if (await this.prisma.user.findUnique({ where: { email: data.email } }))
      throw new BadRequestException('Email already used');
    const hash = await argon2.hash(data.password);
    const user = await this.prisma.user.create({
      data: { ...data, password: hash },
    });
    const { password, ...userPublic } = user;
    return userPublic;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserPublic> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
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
    if (!user) throw new NotFoundException('User not found');
    const isPasswordValid = await argon2.verify(
      user.password,
      data.currentPassword,
    );
    if (!isPasswordValid)
      throw new ForbiddenException('Current password is incorrect');
    const hash = await argon2.hash(data.newPassword);
    return this.prisma.user.update({
      where: { id },
      data: { password: hash },
      select: this.userPublicFields,
    });
  }

  async remove(id: number): Promise<UserPublic> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found or already removed');
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: this.userPublicFields,
    });
  }

  async restore(id: number): Promise<UserPublic> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: { not: null } },
    });
    if (!user || user.deletedAt === null)
      throw new NotFoundException('User not found or not removed');
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
      select: this.userPublicFields,
    });
  }
}
