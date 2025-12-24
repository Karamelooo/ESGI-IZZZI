import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const { user, tokens } = await this.authService.register(dto);
    this.setAccessCookie(res, tokens.accessToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return res.json({ user });
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { user, tokens } = await this.authService.login(dto);
    this.setAccessCookie(res, tokens.accessToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return res.json({ user });
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@CurrentUser() data: any, @Res() res: Response) {
    const tokens = await this.authService.refreshFromGuard(
      data.payload,
      data.refreshToken as string,
    );
    this.setAccessCookie(res, tokens.accessToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return res.json({ ok: true });
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async me(@CurrentUser() data: any) {
    const user = await this.authService.getPublicUser(Number(data.userId));
    return { user };
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  async logout(@CurrentUser() data: any, @Res() res: Response) {
    await this.authService.logout(Number(data.userId));
    this.clearCookies(res);
    return res.json({ message: 'Déconnexion réussie' });
  }

  @Post('logout-all')
  @UseGuards(AccessTokenGuard)
  async logoutAll(@CurrentUser() data: any, @Res() res: Response) {
    await this.authService.logoutAll(Number(data.userId));
    this.clearCookies(res);
    return res.json({ message: 'Déconnexion globale réussie' });
  }

  private setAccessCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 15,
    });
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/auth' });
  }
}
