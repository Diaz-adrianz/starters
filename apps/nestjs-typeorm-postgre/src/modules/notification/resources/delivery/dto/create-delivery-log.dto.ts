import { Exclude } from 'class-transformer';
import { Channel } from '../../../enums/channel.enum';
import { DeliveryLogStatus } from '../../../enums/delivery-log-status.enum';

export class CreateDeliveryLogDto {
  @Exclude()
  channel: Channel;

  @Exclude()
  recipient: string;

  @Exclude()
  status: DeliveryLogStatus;

  @Exclude()
  statusMessage?: string | null;

  @Exclude()
  sentAt?: Date | null;

  @Exclude()
  payload?: Record<string, any> | null;
}
