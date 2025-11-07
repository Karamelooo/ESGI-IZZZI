import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) throw new BadRequestException('Email already in use');
    const hash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hash,
      },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
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
