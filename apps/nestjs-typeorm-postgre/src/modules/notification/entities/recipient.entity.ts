import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../../user/entities/user.entity';
import { Delivery } from './delivery.entity';

@Entity({ schema: 'notification', name: 'recipients' })
@Unique(['notificationId', 'userId'])
export class Recipient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  notificationId: string;

  @Column()
  userId: string;

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date | null;

  @ManyToOne(() => Notification, (n) => n.recipients, { onDelete: 'CASCADE' })
  notification: Notification;

  @ManyToOne(() => User, (u) => u.notifications, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Delivery, (d) => d.recipient)
  deliveries: Delivery[];

  @CreateDateColumn()
  createdAt: Date;
}
