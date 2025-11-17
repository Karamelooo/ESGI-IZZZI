import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AppJwtPayload } from '../auth.types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor() {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('Le secret JWT_ACCESS_SECRET est introuvable');

    super({
      jwtFromRequest: (req: Request) => {
        if (req.cookies && req.cookies.access_token)
          return req.cookies.access_token;
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AppJwtPayload) {
    const token = req.cookies?.access_token;
    if (!token)
      throw new UnauthorizedException("Le jeton d'accès est manquant");

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
      authorizationVersion: payload.authorizationVersion,
      institutionId: payload.institutionId,
    };
  }
}
