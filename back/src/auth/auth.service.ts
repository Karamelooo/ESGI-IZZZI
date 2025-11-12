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
      data: { hashedRefreshToken: null },
    });
  }

  async rotateRefreshToken(
    userId: number,
    oldRefreshToken: string,
  ): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Accès refusé');
    const matches = await argon2.verify(
      user.hashedRefreshToken,
      oldRefreshToken,
    );
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
      data: { hashedRefreshToken: hash },
    });
  }

  async issueTokens(
    userId: number,
    email: string,
    institutionId: number,
    refreshTokenVersion: number,
  ): Promise<Tokens> {
    const payload: any = {
      sub: String(userId),
      email,
      institutionId,
      refreshTokenVersion,
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
        hashedRefreshToken: null,
        refreshTokenVersion: user.refreshTokenVersion + 1,
      },
    });
  }
}
