import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(data.password as string, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        passwordHash: hash,
      },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!user) throw new NotFoundException('User not found');
    if ((data as any).password) {
      const hash = await bcrypt.hash((data as any).password, 10);
      data.password = hash;
      delete (data as any).password;
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: { not: null } },
    });
    if (!user) throw new NotFoundException('User not found or not deleted');
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
