import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PushProvider } from '../enums/push-provider.enum';

@Entity({ schema: 'notification', name: 'push_tokens' })
@Unique(['provider', 'token'])
export class PushToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  userId: string | null;

  @Column('enum', { enum: PushProvider })
  provider: PushProvider;

  @Column('varchar')
  token: string;

  @Column('bool', { default: true })
  enabled: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
