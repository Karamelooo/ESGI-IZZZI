export type Permission =
  | 'user:manage'
  | 'user:read'
  | 'user:create'
  | 'user:update'
  | 'user:delete'
  | 'self:manage'
  | 'self:read'
  | 'self:update'
  | 'self:delete'
  | 'invitation:manage'
  | 'invitation:read'
  | 'invitation:create'
  | 'invitation:update'
  | 'invitation:delete'
  | 'institution:manage'
  | 'institution:read'
  | 'institution:create'
  | 'institution:update'
  | 'institution:delete'
  | 'class:manage'
  | 'class:read'
  | 'class:create'
  | 'class:update'
  | 'class:delete'
  | 'subject:manage'
  | 'subject:read'
  | 'subject:create'
  | 'subject:update'
  | 'subject:delete'
  | 'form:manage'
  | 'form:read'
  | 'form:create'
  | 'form:update'
  | 'form:delete'
  | 'response:manage'
  | 'response:read'
  | 'response:create'
  | 'response:update'
  | 'response:delete';

export const PERMISSIONS: Permission[] = [
  'user:manage',
  'user:read',
  'user:create',
  'user:update',
  'user:delete',
  'self:manage',
  'self:read',
  'self:update',
  'self:delete',
  'invitation:manage',
  'invitation:read',
  'invitation:create',
  'invitation:update',
  'invitation:delete',
  'institution:manage',
  'institution:read',
  'institution:create',
  'institution:update',
  'institution:delete',
  'class:manage',
  'class:read',
  'class:create',
  'class:update',
  'class:delete',
  'subject:manage',
  'subject:read',
  'subject:create',
  'subject:update',
  'subject:delete',
  'form:manage',
  'form:read',
  'form:create',
  'form:update',
  'form:delete',
  'response:manage',
  'response:read',
  'response:create',
  'response:update',
  'response:delete',
];

export const DEFAULT_ROLES: Record<string, Permission[]> = {
  owner: [
    'user:read',
    'self:manage',
    'invitation:create',
    'invitation:delete',
    'institution:read',
    'institution:update',
    'institution:manage',
    'class:manage',
    'subject:manage',
    'form:read',
    'form:create',
    'form:update',
    'response:read',
  ],
  admin: [
    'user:read',
    'self:update',
    'invitation:create',
    'invitation:delete',
    'institution:read',
    'institution:update',
    'institution:manage',
    'class:manage',
    'subject:manage',
    'form:read',
    'form:create',
    'form:update',
    'response:read',
  ],
  manager: [
    'user:read',
    'self:update',
    'institution:read',
    'class:manage',
    'subject:manage',
    'form:read',
    'form:create',
    'form:update',
    'response:read',
  ],
  student: [
    'user:read',
    'self:read',
    'self:update',
    'class:read',
    'subject:read',
    'institution:read',
    'form:read',
    'response:create',
    'response:read',
  ],
};
