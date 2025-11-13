import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor() {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('Le secret JWT_ACCESS_SECRET est introuvable');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: any) {
    console.log('AccessTokenStrategy payload');
    console.log(payload);
    return {
      userId: Number(payload.sub),
      email: payload.email,
      institutionId: payload.institutionId,
      refreshTokenVersion: payload.refreshTokenVersion,
      permissions: payload.permissions,
    };
  }
}
