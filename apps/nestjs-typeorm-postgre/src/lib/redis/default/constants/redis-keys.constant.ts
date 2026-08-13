export const RedisKeys = {
  session: (sessionId: string) => `session:${sessionId}`,
  verifyToken: (tokenHash: string) => `verifyToken:${tokenHash}`,
  resetPasswordToken: (tokenHash: string) => `resetPassword:${tokenHash}`,
  userSessions: (userId: string) => `user:${userId}:sessions`,
};
