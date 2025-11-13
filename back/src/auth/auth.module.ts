import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { PrismaService } from '../prisma/prisma.service';
import { InstitutionService } from '../institution/institution.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    InstitutionService,
    UserService,
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    AccessTokenGuard,
    RefreshTokenGuard,
    PermissionsGuard,
  ],
})
export class AuthModule {}
