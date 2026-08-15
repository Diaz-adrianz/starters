import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Delivery } from './delivery.entity';
import { Message } from './message.entity';

@Entity({ schema: 'notification', name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  recipientId: string;

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date | null;

  @ManyToOne(() => Message, (n) => n.notifications, { onDelete: 'CASCADE' })
  message: Message;

  @OneToMany(() => Delivery, (d) => d.notification)
  deliveries: Delivery[];

  @CreateDateColumn()
  createdAt: Date;
}
