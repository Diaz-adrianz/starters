export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  rolePermissions: (roleId: string) => `role:${roleId}:permissions`,
};
