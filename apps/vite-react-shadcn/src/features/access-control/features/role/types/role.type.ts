import type { Permission } from '../../permission/types/permission.type';
import type { RoleUser } from '../../role-user/types/role-user.type';

export type Role = {
  id: string;
  name: string;
  default: boolean;
  enabled: boolean;

  users: RoleUser[];
  permissions: RolePermission[];
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
