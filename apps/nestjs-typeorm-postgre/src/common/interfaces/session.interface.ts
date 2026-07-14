export interface Session {
  id: string;
  username: string;
  rtHash: string;
  ip?: string;
  userAgent?: string;
  createdAt?: string;
  lastUsedAt?: string;
}
