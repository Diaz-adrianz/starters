import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Delivery } from './delivery.entity';
import { Message } from './message.entity';

@Entity({ schema: 'notification', name: 'notifications' })
@Unique(['messageId', 'userId'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  userId: string;

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date | null;

  @ManyToOne(() => Message, (n) => n.notifications, { onDelete: 'CASCADE' })
  message: Message;

  @ManyToOne(() => User, (u) => u.notifications, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Delivery, (d) => d.notification)
  deliveries: Delivery[];

  @CreateDateColumn()
  createdAt: Date;
}
