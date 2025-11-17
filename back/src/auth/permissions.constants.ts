export type Permission =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete';

export const PERMISSIONS: Permission[] = [
  'users:read',
  'users:create',
  'users:update',
  'users:delete',
];

export const DEFAULT_ROLES: Record<string, Permission[]> = {
  admin: ['users:read', 'users:create', 'users:update', 'users:delete'],
  manager: ['users:read', 'users:create', 'users:update'],
  student: ['users:read'],
};
