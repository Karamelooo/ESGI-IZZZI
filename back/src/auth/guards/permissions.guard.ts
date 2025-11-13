import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionKey } from '../permissions.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  forbiddenAccessMessage = 'Accès refusé : permissions insuffisantes.';

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<PermissionKey[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user || !Array.isArray(user.permissions)) {
      throw new ForbiddenException(this.forbiddenAccessMessage);
    }

    const userPermissions = new Set<string>(user.permissions);
    const hasAllPermissions = required.every((permission) =>
      userPermissions.has(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(this.forbiddenAccessMessage);
    }
    return true;
  }
}
