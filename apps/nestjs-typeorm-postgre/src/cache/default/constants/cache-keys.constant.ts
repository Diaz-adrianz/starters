export const CacheKeys = {
  session: (userId?: string, sessionId?: string) =>
    `session:${userId}:${sessionId ?? ''}`,
  verifyToken: (tokenHash: string) => `verifyToken:${tokenHash}`,
};
