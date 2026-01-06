import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SubjectModule } from '../subject/subject.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, SubjectModule, AuthModule],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
