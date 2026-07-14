export const CacheKeys = {
  session: (sessionId: string) => `session:${sessionId}`,
  userSessions: (userId: string) => `user:${userId}:sessions`,
};
