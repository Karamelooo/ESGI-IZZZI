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

  async findAll(
    institutionId: number,
    withDeleted: boolean = false,
  ): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      where: {
        institutionId,
        ...(withDeleted ? {} : { deletedAt: null }),
      },
      orderBy: { id: 'asc' },
      select: this.userPublicFields,
    });
  }

  private async findOneWhere(
    where: any,
    select?: any,
  ): Promise<UserPublic | User | null> {
    const user = await this.prisma.user.findFirst({
      where,
      ...(select ? { select } : {}),
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return user;
  }

  async findOneById(
    userId: number,
    institutionId: number,
    withDeleted: boolean = false,
  ): Promise<UserPublic | null> {
    const where: any = {
      id: userId,
      institutionId,
      ...(withDeleted ? {} : { deletedAt: null }),
    };

    return this.findOneWhere(
      where,
      this.userPublicFields,
    ) as Promise<UserPublic>;
  }

  async findOneByEmail(
    email: string,
    withDeleted: boolean = false,
  ): Promise<UserPublic | null> {
    const where: any = {
      email,
      ...(withDeleted ? {} : { deletedAt: null }),
    };

    return this.findOneWhere(
      where,
      this.userPublicFields,
    ) as Promise<UserPublic>;
  }

  async findOneWithPassword(
    userId: number,
    withDeleted: boolean = false,
  ): Promise<User | null> {
    const where: any = {
      id: userId,
      ...(withDeleted ? {} : { deletedAt: null }),
    };

    return this.findOneWhere(where) as Promise<User>;
  }

  async create(
    institutionId: number,
    data: CreateUserDto,
  ): Promise<UserPublic> {
    if (await this.prisma.user.findUnique({ where: { email: data.email } }))
      throw new BadRequestException('Email déjà utilisé');

    const hash = await argon2.hash(data.password);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hash,
        institutionId,
      },
    });
    const { password, ...userPublic } = user;

    return userPublic;
  }

  async update(
    userId: number,
    institutionId: number,
    data: UpdateUserDto,
  ): Promise<UserPublic> {
    const user = await this.findOneById(userId, institutionId);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: this.userPublicFields,
    });
  }

  async updatePassword(
    userId: number,
    institutionId: number,
    data: UpdatePasswordDto,
  ): Promise<UserPublic> {
    // For password update, we need to check password, so we use findOneWithPassword but we should also check institutionId
    // But findOneWithPassword doesn't take institutionId in my previous code?
    // Let's rely on findOneById check first or add check here.
    const checkUser = await this.findOneById(userId, institutionId);
    if (!checkUser) throw new NotFoundException('Utilisateur non trouvé');

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

  async remove(userId: number, institutionId: number): Promise<UserPublic> {
    const user = await this.findOneById(userId, institutionId);
    if (!user)
      throw new NotFoundException('Utilisateur non trouvé ou déjà supprimé');

    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
      select: this.userPublicFields,
    });
  }

  async restore(userId: number, institutionId: number): Promise<UserPublic> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, institutionId, deletedAt: { not: null } },
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
