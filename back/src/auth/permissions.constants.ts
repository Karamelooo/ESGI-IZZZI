export type Permission =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'classes:read'
  | 'classes:create'
  | 'classes:update'
  | 'classes:delete'
  | 'subjects:read'
  | 'subjects:create'
  | 'subjects:update'
  | 'subjects:delete'
  | 'institutions:read'
  | 'institutions:create'
  | 'institutions:update'
  | 'institutions:delete';

export const PERMISSIONS: Permission[] = [
  'users:read',
  'users:create',
  'users:update',
  'users:delete',
  'classes:read',
  'classes:create',
  'classes:update',
  'classes:delete',
  'subjects:read',
  'subjects:create',
  'subjects:update',
  'subjects:delete',
  'institutions:read',
  'institutions:create',
  'institutions:update',
  'institutions:delete',
];

export const DEFAULT_ROLES: Record<string, Permission[]> = {
  admin: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'classes:read',
    'classes:create',
    'classes:update',
    'classes:delete',
    'subjects:read',
    'subjects:create',
    'subjects:update',
    'subjects:delete',
    'institutions:read',
    'institutions:create',
    'institutions:update',
    'institutions:delete',
  ],
  manager: [
    'users:read',
    'users:create',
    'users:update',
    'classes:read',
    'classes:create',
    'classes:update',
    'subjects:read',
    'subjects:create',
    'subjects:update',
    'institutions:read',
  ],
  student: ['users:read', 'classes:read', 'subjects:read', 'institutions:read'],
};
