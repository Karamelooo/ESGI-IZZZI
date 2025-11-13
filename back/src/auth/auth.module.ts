import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from './config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { InstitutionService } from '../institution/institution.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    InstitutionService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
