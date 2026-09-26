import type { Permission } from '../../permission/types/permission.type';

export type Role = {
  id: string;
  name: string;
  default: boolean;
  enabled: boolean;

  users: RoleUser[];
  permissions: RolePermission[];
};

export type RoleUser = {
  id: string;
  roleId: string;
  userId: string;
  username: string;

  role: Role;

  createdAt: Date;
};

export type RolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  condition: Record<string, unknown> | null;

  role: Role;
  permission: Permission;

  createdAt: Date;
};
