import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from '../permissions.constants';

export const Permissions = (...permissions: PermissionKey[]) =>
  SetMetadata('permissions', permissions);
