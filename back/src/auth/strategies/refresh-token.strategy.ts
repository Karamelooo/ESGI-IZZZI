import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-cookie',
) {
  constructor() {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret)
      throw new Error('Le secret JWT_REFRESH_SECRET est introuvable');
    super({
      jwtFromRequest: (req: Request) => {
        if (req.cookies && req.cookies.refresh_token)
          return req.cookies.refresh_token;
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: any) {
    const token = req.cookies?.refresh_token;
    if (!token)
      throw new UnauthorizedException("Le jeton d'actualisation est manquant");
    return { payload, refreshToken: token };
  }
}
