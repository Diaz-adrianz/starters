import { Exclude } from 'class-transformer';

export class CreateSessionDto {
  @Exclude()
  id?: string;

  @Exclude()
  userId: string;

  @Exclude()
  refreshTokenHash: string;

  @Exclude()
  deviceId?: string | null;

  @Exclude()
  deviceLabel?: string | null;

  @Exclude()
  deviceType?: string | null;

  @Exclude()
  browser?: string | null;

  @Exclude()
  os?: string | null;

  @Exclude()
  ipAddress?: string | null;

  @Exclude()
  userAgent?: string | null;

  @Exclude()
  expiresAt: Date;

  @Exclude()
  lastUsedAt?: Date | null;

  @Exclude()
  isActive: boolean;
}
