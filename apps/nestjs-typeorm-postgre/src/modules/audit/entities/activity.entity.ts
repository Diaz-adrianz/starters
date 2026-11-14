import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { ActivityOutcome } from '../enums/activity-outcome.enum';

export type ActivityMetadata = Record<string, any>;

@Entity({ schema: 'audit', name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  // when
  @CreateDateColumn({ type: 'timestamptz' })
  loggedAt: Date;

  @Column('varchar', { nullable: true })
  requestId: string | null;

  // where
  @Column('varchar')
  module: string;

  // who
  @Column('varchar')
  actorType: string;

  @Column('varchar', { nullable: true })
  actorId: string | null;

  @Column('varchar', { nullable: true })
  actorName: string | null;

  // what
  @Column('varchar')
  action: string;

  @Column('varchar', { nullable: true })
  resourceType: string | null;

  @Column('varchar', { nullable: true })
  resourceId: string | null;

  @Column('enum', { enum: ActivityOutcome })
  outcome: ActivityOutcome;

  @Column('jsonb', { nullable: true })
  metadata: ActivityMetadata | null;
}
