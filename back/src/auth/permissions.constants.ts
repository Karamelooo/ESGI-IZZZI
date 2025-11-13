export type PermissionKey =
  | 'users:read'
  | 'users:manage'
  | 'users:invite'
  | 'classes:read'
  | 'classes:manage';

export const ALL_PERMISSIONS: PermissionKey[] = [
  'users:read',
  'users:manage',
  'users:invite',
  'classes:read',
  'classes:manage',
];

export const DEFAULT_ROLES: Record<string, PermissionKey[]> = {
  student: ['users:read'],
  manager: ['users:read', 'classes:read'],
  admin: [
    'users:read',
    'users:manage',
    'users:invite',
    'classes:read',
    'classes:manage',
  ],
};
