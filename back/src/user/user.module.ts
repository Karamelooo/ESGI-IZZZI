import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';

@Module({
  providers: [
    UserService,
    PrismaService,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
