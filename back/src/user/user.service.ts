import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getCurrentUser() {
    // Requires auth context (e.g., request.user).
    return null;
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto as any });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    // Ensure existence to throw 404 if needed
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    // Ensure existence to throw 404 if needed
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
