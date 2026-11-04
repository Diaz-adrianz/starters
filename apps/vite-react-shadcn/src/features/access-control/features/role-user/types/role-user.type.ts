import type { Role } from '../../role/types/role.type';

export type RoleUser = {
  id: string;
  roleId: string;
  userId: string;
  username: string;

  role: Role;

  createdAt: Date;
};
