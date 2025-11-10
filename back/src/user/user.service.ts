import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
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

  async findAll(): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { id: 'asc' },
      select: this.userPublicFields,
    });
  }

  async findOne(id: number): Promise<UserPublic | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: this.userPublicFields,
    });
  }

  async findOneWithPassword(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: CreateUserDto): Promise<UserPublic> {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) throw new BadRequestException('Email already in use');
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hash,
      },
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
    const currentPassword = await bcrypt.hash(data.currentPassword, 10);
    console.log(currentPassword);
    console.log(user);
    const passwordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );
    if (!passwordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }
    const hash = await bcrypt.hash(data.newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hash },
      select: this.userPublicFields,
    });
  }

  async remove(id: number): Promise<UserPublic> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found or already deleted');
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
    if (!user) throw new NotFoundException('User not found or not deleted');
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
      select: this.userPublicFields,
    });
  }
}
