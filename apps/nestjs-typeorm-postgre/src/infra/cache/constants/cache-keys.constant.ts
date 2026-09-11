export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userRoles: (userId: string) => `user:${userId}:roles`,
  rolePermissions: (roleId: string) => `role:${roleId}:permissions`,
};
