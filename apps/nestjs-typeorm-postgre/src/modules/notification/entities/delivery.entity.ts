import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryType } from '../enums/delivery-type.enum';
import { Message } from './message.entity';
import { DeliveryPriority } from '../enums/delivery-priority.enum';

export interface DeliverySender {
  name?: string;
  email?: string;
  emailReplyTo?: string;
}

@Entity({ schema: 'notification', name: 'deliveries' })
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { enum: DeliveryType })
  type: DeliveryType;

  @Column('enum', { enum: DeliveryPriority })
  priority: DeliveryPriority;

  @Column('varchar')
  templateKey: string;

  @Column('jsonb', { nullable: true })
  sender: DeliverySender | null;

  @OneToMany(() => Message, (m) => m.delivery)
  messages: Message[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
