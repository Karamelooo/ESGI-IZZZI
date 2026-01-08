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
            const inviteLink = `${process.env.VITE_ALLOWED_HOST || 'http://localhost:5173'}/register?token=${token}`;

            await this.mailService.sendInvitationEmail(
                createInvitationDto.email,
                inviteLink
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
