import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { InstitutionService } from '../institution/institution.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens, AppJwtPayload } from './auth.types';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly institutionService: InstitutionService,
    private readonly userService: UserService,
  ) {}

  async register(data: RegisterDto): Promise<Tokens> {
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
    const adminRole = await this.prisma.role.findUnique({
      where: { name: 'admin' },
    });
    if (adminRole) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: adminRole.id },
      });
      await this.prisma.user.update({
        where: { id: user.id },
        data: { authorizationVersion: { increment: 1 } },
      });
    }

    const refreshTokenVersion = 0;

    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.institutionId,
      refreshTokenVersion,
    );
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async login(data: LoginDto): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });
    if (!user) throw new BadRequestException('Identifiants invalides');
    const valid = await argon2.verify(user.password, data.password);
    if (!valid) throw new BadRequestException('Identifiants invalides');
    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.institutionId,
      user.refreshTokenVersion,
    );
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async rotateRefreshToken(
    userId: number,
    oldRefreshToken: string,
  ): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Accès refusé');
    const matches = await argon2.verify(user.refreshToken, oldRefreshToken);
    if (!matches) throw new ForbiddenException('Accès refusé');
    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.institutionId,
      user.refreshTokenVersion,
    );
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async storeRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  async issueTokens(
    userId: number,
    email: string,
    institutionId: number,
    refreshTokenVersion: number,
  ): Promise<Tokens> {
    const { roles, permissions, authorizationVersion } =
      await this.getRolesPermissionsAndVersion(userId);

    const payload: AppJwtPayload = {
      sub: String(userId),
      email,
      institutionId,
      refreshTokenVersion,
      authorizationVersion,
      roles,
      permissions,
    };

    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessSecret || !refreshSecret)
      throw new Error('Les secrets JWT ne sont pas définis');

    const accessToken = await this.jwt.signAsync(payload, {
      secret: accessSecret,
      expiresIn: process.env.JWT_ACCESS_EXPIRES ?? '15m',
    } as JwtSignOptions);

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: process.env.JWT_REFRESH_EXPIRES ?? '30d',
    } as JwtSignOptions);

    return { accessToken, refreshToken };
  }

  async refreshFromGuard(
    payload: AppJwtPayload,
    refreshToken: string,
  ): Promise<Tokens> {
    return this.rotateRefreshToken(Number(payload.sub), refreshToken);
  }

  async invalidateAllSessions(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenVersion: user.refreshTokenVersion + 1,
      },
    });
  }

  private async getRolesPermissionsAndVersion(userId: number): Promise<{
    roles: string[];
    permissions: string[];
    authorizationVersion: number;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { authorizationVersion: true },
    });
    const roles = await this.prisma.role.findMany({
      where: { userRoles: { some: { userId } } },
      select: {
        name: true,
        rolePermissions: {
          select: { permission: { select: { key: true } } },
        },
      },
    });
    const roleNames = roles.map((r) => r.name);
    const permSet = new Set<string>();
    for (const r of roles) {
      for (const rp of r.rolePermissions) {
        permSet.add(rp.permission.key);
      }
    }
    return {
      roles: roleNames,
      permissions: Array.from(permSet.values()),
      authorizationVersion: user?.authorizationVersion ?? 0,
    };
  }

  private async ensureDefaultRolesAndPermissions(): Promise<void> {
    const permissions = await this.prisma.permission.findMany();
    if (permissions.length > 0) return;

    const defaultPermissions = ['users:read'];

    await this.prisma.permission.createMany({
      data: defaultPermissions.map((permission) => ({ key: permission })),
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
