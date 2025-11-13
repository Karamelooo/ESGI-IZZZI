import { SetMetadata } from '@nestjs/common';
import { Permission } from '../permissions.constants';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);
