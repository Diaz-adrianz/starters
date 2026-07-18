export const CacheKeys = {
  session: (userId?: string, sessionId?: string) =>
    `session:${userId}:${sessionId ?? ''}`,
  verifyToken: (tokenHash: string) => `verifyToken:${tokenHash}`,
  resetPasswordToken: (tokenHash: string) => `resetPassword:${tokenHash}`,
  user: (userId: string) => `user:${userId}`,
  rolePermissions: (roleId: string) => `role:${roleId}:permissions`,
};
