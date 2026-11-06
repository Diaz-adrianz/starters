import type { RolePermission } from '../../role-permission/types/role-permission.type';
import type { RoleUser } from '../../role-user/types/role-user.type';

export type Role = {
  id: string;
  name: string;
  default: boolean;
  enabled: boolean;

  users: RoleUser[];
  permissions: RolePermission[];
};
