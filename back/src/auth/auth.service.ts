import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { InstitutionService } from '../institution/institution.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly institutionService: InstitutionService,
    private readonly userService: UserService,
  ) { }

  async register(data: RegisterDto): Promise<{ user: any; tokens: Tokens }> {
    const institution = await this.institutionService.create({
      name: data.institutionName,
    });
    const user = await this.userService.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      institutionId: institution.id,
    });
    await this.ensureDefaultRolesAndPermissions();
    await this.assignAdminRole(user.id);
    const tokens = await this.issueTokens(user.id);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return { user: this.toPublicUser(user), tokens };
  }

  async login(data: LoginDto): Promise<{ user: any; tokens: Tokens }> {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });
    if (!user) throw new BadRequestException('Identifiants invalides');
    const valid = await argon2.verify(user.password, data.password);
    if (!valid) throw new BadRequestException('Identifiants invalides');
    const tokens = await this.issueTokens(user.id);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return { user: this.toPublicUser(user), tokens };
  }

  async refreshFromGuard(payload: any, refreshToken: string): Promise<Tokens> {
    const userId = Number(payload.sub);
    await this.verifyStoredRefreshToken(userId, refreshToken);
    const tokens = await this.issueTokens(userId);
    await this.rotateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async logoutAll(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null, refreshTokenVersion: { increment: 1 } },
    });
  }

  async getPublicUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('Utilisateur introuvable');
    return this.toPublicUser(user);
  }

  async issueTokens(userId: number): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('Accès refusé');
    const accessToken = await this.jwt.signAsync(
      {
        sub: String(user.id),
        authorizationVersion: user.authorizationVersion,
        institutionId: user.institutionId,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as JwtSignOptions['expiresIn'],
      },
    );
    const refreshToken = await this.jwt.signAsync(
      {
        sub: String(user.id),
        refreshTokenVersion: user.refreshTokenVersion,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES || '30d') as JwtSignOptions['expiresIn'],
      },
    );
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashed = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }

  async rotateRefreshToken(
    userId: number,
    newRefreshToken: string,
  ): Promise<void> {
    const hashed = await argon2.hash(newRefreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }

  async verifyStoredRefreshToken(
    userId: number,
    incoming: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Accès refusé');
    const ok = await argon2.verify(user.refreshToken, incoming);
    if (!ok) throw new ForbiddenException('Accès refusé');
  }

  private toPublicUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      institutionId: user.institutionId,
    };
  }

  private async assignAdminRole(userId: number) {
    const role = await this.prisma.role.findUnique({
      where: { name: 'admin' },
    });
    if (!role) return;
    await this.prisma.userRole.create({ data: { userId, roleId: role.id } });
    await this.prisma.user.update({
      where: { id: userId },
      data: { authorizationVersion: { increment: 1 } },
    });
  }

  private async ensureDefaultRolesAndPermissions(): Promise<void> {
    const existing = await this.prisma.permission.findMany();
    if (existing.length > 0) return;
    const defaultPermissions = ['users:read'];
    await this.prisma.permission.createMany({
      data: defaultPermissions.map((p) => ({ key: p })),
      skipDuplicates: true,
    });
    const admin = await this.prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin', system: true },
    });
    const manager = await this.prisma.role.upsert({
      where: { name: 'manager' },
      update: {},
      create: { name: 'manager', system: true },
    });
    const student = await this.prisma.role.upsert({
      where: { name: 'student' },
      update: {},
      create: { name: 'student', system: true },
    });
    const perms = await this.prisma.permission.findMany();
    const byKey = new Map(perms.map((p) => [p.key, p]));
    const studentKeys = ['reviews:create'];
    const managerKeys = [
      'reviews:read',
      'reviews:read_summary',
      'classes:manage',
      'subjects:manage',
      'users:read',
    ];
    const adminKeys = [
      'reviews:read',
      'reviews:read_summary',
      'classes:manage',
      'subjects:manage',
      'users:read',
      'users:manage',
      'billing:read',
    ];
    await this.prisma.rolePermission.createMany({
      data: studentKeys.map((k) => ({
        roleId: student.id,
        permissionId: byKey.get(k)!.id,
      })),
      skipDuplicates: true,
    });
    await this.prisma.rolePermission.createMany({
      data: managerKeys.map((k) => ({
        roleId: manager.id,
        permissionId: byKey.get(k)!.id,
      })),
      skipDuplicates: true,
    });
    await this.prisma.rolePermission.createMany({
      data: adminKeys.map((k) => ({
        roleId: admin.id,
        permissionId: byKey.get(k)!.id,
      })),
      skipDuplicates: true,
    });
  }
}
