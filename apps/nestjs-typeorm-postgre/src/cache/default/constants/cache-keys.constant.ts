export const CacheKeys = {
  session: (userId?: string, sessionId?: string) =>
    `session:${userId}:${sessionId ?? ''}`,
};
