export type PermissionKey =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete';

export type Permission = {
  key: PermissionKey;
  description: string;
};

export const ALL_PERMISSIONS: Permission[] = [
  {
    key: 'users:read',
    description: 'Voir la liste et le détail des utilisateurs',
  },
  {
    key: 'users:create',
    description: 'Créer de nouveaux utilisateurs',
  },
  {
    key: 'users:update',
    description: 'Modifier les informations des utilisateurs',
  },
  {
    key: 'users:delete',
    description: 'Supprimer des utilisateurs',
  },
];

export const DEFAULT_ROLES: Record<string, PermissionKey[]> = {
  student: ['users:read'],
  manager: ['users:read', 'users:create', 'users:update'],
  admin: ['users:read', 'users:create', 'users:update', 'users:delete'],
};
