import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `.env`,
      cache: true,
    }),
    PrismaModule,
    UserModule,
    ClassesModule,
    SubjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
