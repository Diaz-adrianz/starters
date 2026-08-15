import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Notification } from './notification.entity';
import { DeliveryChannel } from '../enums/delivery-channel.enum';
import { DeliveryStatus } from '../enums/delivery-status.enum';

@Entity({ schema: 'notification', name: 'deliveries' })
@Unique(['notificationId', 'channel'])
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  notificationId: string;

  @Column({ type: 'enum', enum: DeliveryChannel })
  channel: DeliveryChannel;

  @Column({ type: 'enum', enum: DeliveryStatus })
  status: DeliveryStatus;

  @Column({ type: 'int', nullable: true })
  attemptCount: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastAttemptAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  providerResponse: string | null;

  @ManyToOne(() => Notification, (n) => n.deliveries, { onDelete: 'CASCADE' })
  notification: Notification;
}
