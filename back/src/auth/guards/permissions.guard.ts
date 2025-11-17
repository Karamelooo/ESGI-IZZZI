import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../permissions.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.permissions) {
      throw new ForbiddenException(
        'Accès refusé : permissions insuffisantes. (1)',
      );
    }

    const hasPermission = requiredPermissions.every((p) =>
      user.permissions.includes(p),
    );
    if (!hasPermission) {
      throw new ForbiddenException(
        'Accès refusé : permissions insuffisantes. (2)',
      );
    }

    return true;
  }
}
