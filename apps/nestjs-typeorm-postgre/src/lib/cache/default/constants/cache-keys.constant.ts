export const CacheKeys = {
  session: (sessionId: string) => `session:${sessionId}`,
  verifyToken: (tokenHash: string) => `verifyToken:${tokenHash}`,
  resetPasswordToken: (tokenHash: string) => `resetPassword:${tokenHash}`,
  user: (userId: string) => `user:${userId}`,
  userSessions: (userId: string) => `user:${userId}:sessions`,
  rolePermissions: (roleId: string) => `role:${roleId}:permissions`,
};
