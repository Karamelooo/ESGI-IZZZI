import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt-access') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException(
        'Non autorisé : token invalide ou expiré.',
      );
    }
    return user;
  }
}
