import databaseConfig from './config/database.config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InstitutionModule } from './institution/institution.module';
import { ClassModule } from './class/class.module';
import { SubjectModule } from './subject/subject.module';
import { PaymentModule } from './payment/payment.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FormTemplateModule } from './form-template/form-template.module';
import { FormModule } from './form/form.module';
import { ResponseModule } from './response/response.module';
import { InvitationModule } from './invitation/invitation.module';
import { MailModule } from './mail/mail.module';

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
    ClassModule,
    SubjectModule,
    PaymentModule,
    SubscriptionModule,
    FormTemplateModule,
    FormModule,
    ResponseModule,
    InvitationModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
