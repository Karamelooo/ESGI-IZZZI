import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [PrismaModule, AuthModule, MailModule, GeminiModule],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
