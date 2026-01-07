import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [AuthModule, MailModule],
    controllers: [InvitationController],
    providers: [InvitationService, PrismaService],
    exports: [InvitationService],
})
export class InvitationModule { }
