import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const valid = await bcrypt.compare(password, user.password);
    if (!user || !valid)
      throw new UnauthorizedException('Identifiants invalides');
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = {
      sub: user.id,
      email: user.email,
      institutionId: user.institutionId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (exists) throw new BadRequestException('Cet email est déjà utilisé');
    const hash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: hash,
        institutionId: registerDto.institutionId,
      },
    });
    const payload = {
      sub: user.id,
      email: user.email,
      institutionId: user.institutionId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
