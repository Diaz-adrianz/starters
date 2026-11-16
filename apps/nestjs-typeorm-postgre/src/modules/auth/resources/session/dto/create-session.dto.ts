import { Exclude } from 'class-transformer';
import {
  ClientDevice,
  ClientType,
} from '../../../../../shared/constants/client.constant';

export class CreateSessionDto {
  @Exclude()
  id?: string;

  @Exclude()
  userId: string;

  @Exclude()
  refreshTokenHash: string;

  @Exclude()
  clientId?: string | null;

  @Exclude()
  clientLabel?: string | null;

  @Exclude()
  clientType?: ClientType | null;

  @Exclude()
  clientDevice?: ClientDevice | null;

  @Exclude()
  browser?: string | null;

  @Exclude()
  os?: string | null;

  @Exclude()
  osVersion?: string | null;

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
