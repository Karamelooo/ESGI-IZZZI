import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    private getHtmlTemplate(title: string, content: string, button?: { text: string, url: string }): string {
        const year = new Date().getFullYear();
        const buttonHtml = button ? `
            <div style="margin-top: 32px;">
                <a href="${button.url}" class="button" style="color: #ffffff;">${button.text}</a>
            </div>
        ` : '';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
                    body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background-color: #ffe552; padding: 32px; text-align: center; }
                    .header h1 { margin: 0; color: #000000; font-family: sans-serif; font-size: 28px; letter-spacing: 2px; }
                    .content { padding: 40px 32px; color: #2f2e2c; text-align: center; }
                    .title { font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #000000; }
                    .message { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #555555; text-align: left; }
                    .button { display: inline-block; background-color: #f69d04; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; transition: background-color 0.3s; }
                    .button:hover { background-color: #d98600; }
                    .footer { background-color: #fbfbfb; padding: 24px; text-align: center; font-size: 12px; color: #888888; }
                </style>
            </head>
            <body>
                <div style="padding: 40px 0;">
                    <div class="container">
                        <div class="header">
                            <h1>IZZZI</h1>
                        </div>
                        <div class="content">
                            <h2 class="title">${title}</h2>
                            <div class="message">
                                ${content}
                            </div>
                            ${buttonHtml}
                        </div>
                        <div class="footer">
                            &copy; ${year} IZZZI. Tous droits réservés.
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    public async sendExampleEmail(to: string, subject: string, content: string): Promise<void> {
        const html = this.getHtmlTemplate(subject, content);
        await this.mailerService.sendMail({
            to: to,
            subject: subject,
            text: content.replace(/<[^>]*>?/gm, ''),
            html: html,
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
        const content = `
            <p>Une nouvelle demande de plan personnalisé "sur mesure" a été soumise.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>École ou organisme :</strong> ${data.institutionName}</p>
            <p><strong>Nom du contact :</strong> ${data.lastName} ${data.firstName}</p>
            <p><strong>Email :</strong> ${data.email}</p>
            <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
            <p><strong>Nombre de classes :</strong> ${data.approximateClasses}</p>
            <p><strong>Message :</strong><br/>${data.message || 'Pas de message'}</p>
            <p><strong>Rappel souhaité :</strong> ${data.callbackRequested ? 'Oui' : 'Non'}</p>
        `;

        const html = this.getHtmlTemplate("Nouvelle demande de plan sur mesure", content);

        await this.mailerService.sendMail({
            to: process.env.MAIL_FROM,
            subject: subject,
            html: html,
        });
    }

    public async sendContactConfirmationEmail(email: string, lastName: string, firstName: string): Promise<void> {
        const subject = 'Confirmation de votre demande - IZZZI';
        const content = `
            <p>Bonjour ${firstName} ${lastName},</p>
            <p>Nous avons bien reçu votre demande de plan sur mesure pour votre établissement.</p>
            <p>Notre équipe va étudier votre demande et reviendra vers vous dans les plus brefs délais avec une proposition adaptée à vos besoins.</p>
            <p>Merci de votre confiance.</p>
            <p>L'équipe IZZZI</p>
        `;

        const html = this.getHtmlTemplate("Demande bien reçue !", content);

        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            html: html,
        });
    }

    public async sendResetPasswordEmail(email: string, token: string): Promise<void> {
        const resetUrl = `${process.env.VITE_ALLOWED_HOST || 'http://localhost:5173'}/auth/change-password?token=${token}`;
        const subject = 'Réinitialisation de votre mot de passe - Izzzi';
        const content = `
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Izzzi.</p>
            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            <p>Ce lien est valable pendant 15 minutes.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
            <p>L'équipe Izzzi</p>
        `;

        const html = this.getHtmlTemplate("Réinitialisation de mot de passe", content, {
            text: "Réinitialiser mon mot de passe",
            url: resetUrl
        });

        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            html: html,
        });
    }

    public async sendFormReminderEmail(email: string, formName: string, formUrl: string): Promise<void> {
        const subject = `Rappel : Formulaire de satisfaction - ${formName}`;
        const content = `
            <p>Bonjour,</p>
            <p>Nous vous rappelons qu'un formulaire de satisfaction est disponible pour le cours <strong>${formName}</strong>.</p>
            <p>Merci de prendre quelques minutes pour le compléter en cliquant sur le bouton ci-dessous :</p>
            <p>Vos retours sont précieux pour nous aider à améliorer la qualité de nos formations.</p>
            <p>L'équipe pédagogique</p>
        `;

        const html = this.getHtmlTemplate("Votre avis nous intéresse", content, {
            text: "Répondre au formulaire",
            url: formUrl
        });

        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            html: html,
        });
    }

    public async sendInvitationEmail(email: string, inviteLink: string): Promise<void> {
        const subject = 'Invitation à rejoindre IZZZI';
        const content = `
            <p>Bonjour,</p>
            <p>Vous avez été invité à rejoindre l'espace de travail <strong>IZZZI</strong>.</p>
            <p>Cliquez sur le bouton ci-dessous pour accepter l'invitation et créer votre compte.</p>
            <p>Ce lien expirera dans 7 jours.</p>
        `;

        const html = this.getHtmlTemplate("Vous avez été invité !", content, {
            text: "Rejoindre IZZZI",
            url: inviteLink
        });

        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            html: html,
        });
    }
}

