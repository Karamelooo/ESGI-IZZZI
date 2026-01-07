import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                const transport: any = {
                    host: config.get('MAIL_HOST'),
                    port: config.get('MAIL_PORT'),
                    secure: false, 
                };

                const mailUser = config.get('MAIL_USER');
                const mailPassword = config.get('MAIL_PASSWORD');

                if (mailUser && mailPassword) {
                    transport.auth = {
                        user: mailUser,
                        pass: mailPassword,
                    };
                }

                return {
                    transport,
                    defaults: {
                        from: `"No Reply" <${config.get('MAIL_FROM')}>`,
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
