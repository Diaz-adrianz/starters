import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'auth', name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Exclude({ toPlainOnly: true })
  @Column('varchar')
  refreshTokenHash: string;

  @Column('varchar', { nullable: true })
  deviceId: string | null;

  @Column('varchar', { nullable: true })
  deviceLabel: string | null;

  @Column('varchar', { nullable: true })
  deviceType: string | null;

  @Column('varchar', { nullable: true })
  browser: string | null;

  @Column('varchar', { nullable: true })
  os: string | null;

  @Column('varchar', { nullable: true })
  ipAddress: string | null;

  @Column('varchar', { nullable: true })
  userAgent: string | null;

  @Column('timestamptz')
  expiresAt: Date;

  @Column('timestamptz', { nullable: true })
  lastUsedAt: Date | null;

  @Column('bool', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
