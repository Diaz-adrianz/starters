import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipient } from './recipient.entity';

@Entity({ schema: 'notification', name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data: string | null;

  @OneToMany(() => Recipient, (r) => r.notification)
  recipients: Recipient[];

  @CreateDateColumn()
  createdAt: Date;
}
