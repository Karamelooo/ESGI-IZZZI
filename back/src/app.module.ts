import databaseConfig from './config/database.config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InstitutionModule } from './institution/institution.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `.env`,
      cache: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    InstitutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
