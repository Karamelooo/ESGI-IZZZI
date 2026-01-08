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

    public async sendContactRequestEmail(data: {
        institutionName: string;
        lastName: string;
        firstName: string;
        email: string;
        phone?: string;
        approximateClasses: number;
        message?: string;
        callbackRequested: boolean;
    }): Promise<void> {
        const subject = `Nouvelle demande de plan sur mesure : ${data.institutionName}`;
        const html = `
            <h2>Nouvelle demande de contact (Plan > 20 classes)</h2>
            <p><strong>École ou organisme :</strong> ${data.institutionName}</p>
            <p><strong>Nom :</strong> ${data.lastName} ${data.firstName}</p>
            <p><strong>Email professionnel :</strong> ${data.email}</p>
            <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
            <p><strong>Nombre de classes / étudiants :</strong> ${data.approximateClasses}</p>
            <p><strong>Message :</strong><br/>${data.message || 'Pas de message'}</p>
            <p><strong>Souhaite être rappelé :</strong> ${data.callbackRequested ? 'Oui' : 'Non'}</p>
        `;

        await this.mailerService.sendMail({
            to: process.env.MAIL_FROM,
            subject: subject,
            html: html,
        });
    }

    public async sendResetPasswordEmail(email: string, token: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/change-password?token=${token}`;
        const subject = 'Réinitialisation de votre mot de passe - Izzzi';
        const html = `
            <h2>Réinitialisation de votre mot de passe</h2>
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Izzzi.</p>
            <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>Ce lien est valable pendant 15 minutes.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
            <p>L'équipe Izzzi</p>
        `;

        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            html: html,
        });
    }
}
