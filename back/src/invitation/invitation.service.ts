import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';

import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
    ) { }

    async create(institutionId: number, createInvitationDto: CreateInvitationDto) {
        const token = randomBytes(32).toString('hex');
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); 

        const invitation = await this.prisma.invitation.create({
            data: {
                token,
                institutionId,
                email: createInvitationDto.email,
                role: createInvitationDto.role,
                expirationDate,
            },
        });

        if (createInvitationDto.email) {
            const inviteLink = `${process.env.VITE_FRONT_URL || 'http://localhost:5173'}/register?token=${token}`;

            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background-color: #ffe552; padding: 32px; text-align: center; }
                    .header h1 { margin: 0; color: #000000; font-family: sans-serif; font-size: 28px; letter-spacing: 2px; }
                    .content { padding: 40px 32px; color: #2f2e2c; text-align: center; }
                    .title { font-size: 24px; font-weight: 600; margin-bottom: 16px; color: #000000; }
                    .message { font-size: 16px; line-height: 1.6; margin-bottom: 32px; color: #555555; }
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
                            <h2 class="title">Vous avez été invité !</h2>
                            <p class="message">
                                Bonjour,<br><br>
                                Vous avez été invité à rejoindre l'espace de travail <strong>IZZZI</strong>.<br>
                                Cliquez sur le bouton ci-dessous pour accepter l'invitation et créer votre compte.
                            </p>
                            <a href="${inviteLink}" class="button" style="color: #ffffff;">Rejoindre IZZZI</a>
                            <p style="margin-top: 32px; font-size: 14px; color: #999;">
                                Ce lien expirera dans 7 jours.
                            </p>
                        </div>
                        <div class="footer">
                            &copy; ${new Date().getFullYear()} IZZZI. Tous droits réservés.
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `;

            await this.mailService.sendExampleEmail(
                createInvitationDto.email,
                'Invitation à rejoindre IZZZI',
                htmlContent 
            );
        }

        return invitation;
    }

    async findAll(institutionId: number) {
        return this.prisma.invitation.findMany({
            where: { institutionId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOneByToken(token: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
            include: { institution: true }
        });

        if (!invitation) throw new NotFoundException('Invitation introuvable');
        if (invitation.expirationDate < new Date()) throw new NotFoundException('Invitation expirée');
        if (invitation.status !== 'PENDING') throw new NotFoundException('Invitation déjà utilisée');

        return invitation;
    }

    async accept(token: string, userData: any) {
        const invitation = await this.findOneByToken(token);

        const hash = await argon2.hash(userData.password);

        
        const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
        if (existingUser) throw new BadRequestException('Email déjà utilisé');

        const user = await this.prisma.user.create({
            data: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                password: hash,
                institutionId: invitation.institutionId,
            }
        });

        
        const role = await this.prisma.role.findUnique({ where: { name: invitation.role } });
        if (role) {
            await this.prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: role.id
                }
            });
        }

        
        await this.prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: 'ACCEPTED' }
        });

        return user;
    }
}
