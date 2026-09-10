import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from '../enums/channel.enum';

@Entity({ schema: 'notification', name: 'templates' })
@Unique(['key', 'channel'])
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  key: string;

  @Column('enum', { enum: Channel })
  channel: Channel;

  @Column('varchar')
  title: string;

  @Column('text')
  body: string;

  @Column('text', { array: true })
  availableKeys: string[];

  @Column('text', { array: true })
  sensitiveKeys: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
