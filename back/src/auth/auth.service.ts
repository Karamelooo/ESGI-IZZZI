import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens, AppJwtPayload } from './auth.types';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Tokens> {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
    });
    if (existing) throw new BadRequestException('Email already used');
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: passwordHash,
        institutionId: dto.institutionId,
        refreshTokenVersion: 0,
      },
    });
    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.institutionId,
      user.refreshTokenVersion,
    );
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
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
      data: { hashedRefreshToken: null },
    });
  }

  async rotateRefreshToken(
    userId: number,
    oldRefreshToken: string,
  ): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access denied');
    const matches = await argon2.verify(
      user.hashedRefreshToken,
      oldRefreshToken,
    );
    if (!matches) throw new ForbiddenException('Access denied');
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
      data: { hashedRefreshToken: hash },
    });
  }

  async issueTokens(
    userId: number,
    email: string,
    institutionId: number,
    rtv: number,
  ): Promise<Tokens> {
    const payload: any = { sub: String(userId), email, institutionId, rtv };
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessSecret || !refreshSecret)
      throw new Error('JWT secrets are not defined');
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
        hashedRefreshToken: null,
        refreshTokenVersion: user.refreshTokenVersion + 1,
      },
    });
  }
}
