import { Module } from '@nestjs/common';
import { FormTemplateController } from './form-template.controller';
import { FormTemplateService } from './form-template.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FormTemplateController],
  providers: [FormTemplateService],
})
export class FormTemplateModule {}
