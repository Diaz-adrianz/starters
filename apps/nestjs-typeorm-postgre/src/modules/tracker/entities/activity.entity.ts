import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityLevel } from '../enums/activity-level.enum';
import { ActorType } from '../enums/actor-type.enum';

@Entity({ schema: 'tracker', name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { enum: ActivityLevel })
  level: ActivityLevel;

  @Column('varchar')
  module: string;

  @Column('varchar', { nullable: true })
  description: string | null;

  @Column('enum', { enum: ActorType })
  actorType: ActorType;

  @Column('varchar', { nullable: true })
  actorId: string | null;

  @Column('varchar', { nullable: true })
  actorName: string | null;

  @Column('varchar', { nullable: true })
  targetType: string | null;

  @Column('varchar', { nullable: true })
  targetId: string | null;

  @Column('varchar', { nullable: true })
  targetName: string | null;

  @Column('varchar')
  action: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;
}
