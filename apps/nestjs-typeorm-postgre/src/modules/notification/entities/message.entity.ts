import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Delivery } from './delivery.entity';

@Entity({ schema: 'notification', name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  deliveryId: string;

  @Column('uuid')
  userId: string;

  @Column('varchar')
  title: string;

  @Column('text')
  body: string;

  @Column('varchar', { nullable: true })
  actionUrl: string | null;

  @Column('timestamptz', { nullable: true })
  readAt: Date | null;

  @Column('jsonb', { nullable: true })
  payload: Record<string, any> | null;

  @ManyToOne(() => Delivery, (d) => d.messages, { onDelete: 'CASCADE' })
  delivery: Delivery;

  @CreateDateColumn()
  createdAt: Date;
}
