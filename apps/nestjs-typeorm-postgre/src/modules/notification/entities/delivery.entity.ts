import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from '../enums/type.enum';
import { DeliveryLog } from './delivery-log.entity';
import { Message } from './message.entity';

@Entity({ schema: 'notification', name: 'deliveries' })
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { enum: Type })
  type: Type;

  @Column('varchar')
  templateKey: string;

  @OneToMany(() => DeliveryLog, (dl) => dl.delivery)
  logs: DeliveryLog[];

  @OneToMany(() => Message, (m) => m.delivery)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
