import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Channel } from '../enums/channel.enum';
import { DeliveryLogStatus } from '../enums/delivery-log-status.enum';
import { Delivery } from './delivery.entity';

@Entity({ schema: 'notification', name: 'delivery_logs' })
@Unique(['deliveryId', 'channel', 'recipient'])
export class DeliveryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  deliveryId: string;

  @Column('enum', { enum: Channel })
  channel: Channel;

  @Column('varchar')
  recipient: string;

  @Column('enum', { enum: DeliveryLogStatus })
  status: DeliveryLogStatus;

  @Column('varchar', { nullable: true })
  statusMessage: string | null;

  @Column('timestamptz', { nullable: true })
  sentAt: Date | null;

  @Column('int', { nullable: true })
  attemptsCount: number | null;

  @Column('jsonb', { nullable: true })
  payload: Record<string, any> | null;

  @ManyToOne(() => Delivery, (d) => d.logs, { onDelete: 'CASCADE' })
  delivery: Delivery;
}
