export interface ClientInfo {
  ip?: string;
  userAgent?: string;
  deviceId?: string | null;
  deviceIdSignature?: string | null;
  refreshToken?: string | null;
}
