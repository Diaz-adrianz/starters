import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './notification.entity';
import { Template } from './template.entity';
import { MessageType } from '../enums/message-type.enum';

export type MessageContext = Record<string, any>;

@Entity({ schema: 'notification', name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  templateId: string;

  @Column({ type: 'enum', enum: MessageType })
  type: MessageType;

  @Column({ type: 'jsonb', nullable: true })
  context: MessageContext | null;

  @ManyToOne(() => Template, (t) => t.messages, { onDelete: 'CASCADE' })
  template: Template;

  @OneToMany(() => Notification, (n) => n.message)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
