import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AppJwtPayload } from '../auth.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
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
    if (!token) throw new UnauthorizedException('Refresh token missing');
    return {
      payload: {
        sub: Number(payload.sub),
        email: payload.email,
        institutionId: payload.institutionId,
        refreshTokenVersion: payload.refreshTokenVersion,
      },
      refreshToken: token,
    };
  }
}
