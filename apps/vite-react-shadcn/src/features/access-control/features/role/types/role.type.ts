export type Role = {
  id: string;
  name: string;
  default: boolean;
  enabled: boolean;

  users: RoleUser[];
};

export type RoleUser = {
  id: string;
  roleId: string;
  userId: string;
  username: string;

  role: Role;

  createdAt: Date;
};
