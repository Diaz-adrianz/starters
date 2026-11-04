import type { Permission } from '../../permission/types/permission.type';
import type { Role } from '../../role/types/role.type';

export type RolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  condition: Record<string, unknown> | null;

  role: Role;
  permission: Permission;

  createdAt: Date;
};
