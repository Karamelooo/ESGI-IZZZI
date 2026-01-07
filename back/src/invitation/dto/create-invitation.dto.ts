import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInvitationDto {
    @IsEmail({}, { message: 'Format email invalide' })
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    role: string = 'manager';
}
