import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PermissionsService } from './permissions.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { PrismaService } from '../prisma/prisma.service';
import { InstitutionService } from '../institution/institution.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PermissionsService,
    PrismaService,
    InstitutionService,
    UserService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    PermissionsService,
    JwtModule,
    PassportModule,
    AccessTokenGuard,
    RefreshTokenGuard,
    PermissionsGuard,
  ],
})
export class AuthModule {}
