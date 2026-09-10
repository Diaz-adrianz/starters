export type Session = {
  id: string;
  userId: string;
  deviceId?: string | null;
  deviceLabel?: string | null;
  deviceType?: string | null;
  browser?: string | null;
  os?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  expiresAt: Date;
  lastUsedAt?: Date | null;
  isActive: boolean;
};
