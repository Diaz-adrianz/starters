import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipient } from './recipient.entity';

export enum DeliveryChannel {
  EMAIL = 'email',
  FCM = 'fcm',
}

@Entity({ schema: 'notification', name: 'deliveries' })
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recipientId: string;

  @Column({ type: 'enum', enum: DeliveryChannel })
  channel: DeliveryChannel;

  @ManyToOne(() => Recipient, (n) => n.deliveries, { onDelete: 'CASCADE' })
  recipient: Recipient;

  @CreateDateColumn()
  createdAt: Date;
}
