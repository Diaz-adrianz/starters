import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { ActorType } from '../enums/actor-type.enum';
import { ActivityStatus } from '../enums/activity-status.enum';

export type ActivityContext = {
  path?: string;
  ip?: string;
  userAgent?: string;
};

export type ActivityChanges = {
  before?: any;
  after?: any;
};

export type ActivityMeta = Record<string, any>;

@Entity({ schema: 'audit', name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column('enum', { enum: ActorType })
  actorType: ActorType;

  @Column('varchar', { nullable: true })
  actorId: string | null;

  @Column('varchar', { nullable: true })
  actorName: string | null;

  @Column('varchar')
  module: string;

  @Column('varchar')
  action: string;

  @Column('enum', { enum: ActivityStatus, default: ActivityStatus.SUCCESS })
  status: ActivityStatus;

  @Column('varchar', { nullable: true })
  targetType: string | null;

  @Column('varchar', { nullable: true })
  targetId: string | null;

  @Column('varchar', { nullable: true })
  targetName: string | null;

  @Column('varchar', { nullable: true })
  requestId: string | null;

  @Column('jsonb', { nullable: true })
  context: ActivityContext | null;

  @Column('jsonb', { nullable: true })
  changes: ActivityChanges | null;

  @Column('jsonb', { nullable: true })
  meta: ActivityMeta | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
