import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    public async sendExampleEmail(to: string, subject: string, content: string): Promise<void> {
        await this.mailerService.sendMail({
            to: to,
            
            subject: subject,
            text: content.replace(/<[^>]*>?/gm, ''), 
            html: content, 
        });
    }
}
