export type Session = {
  id: string;
  userId: string;
  clientId?: string | null;
  clientLabel?: string | null;
  clientType?: string | null;
  clientDevice?: string | null;
  browser?: string | null;
  os?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  expiresAt: Date;
  lastUsedAt?: Date | null;
  isActive: boolean;
};
