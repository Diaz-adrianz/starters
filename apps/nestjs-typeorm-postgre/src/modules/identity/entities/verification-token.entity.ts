import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VerificationTokenType } from '../enums/verification-token-type.enum';
import { User } from './user.entity';

@Entity({ schema: 'identity', name: 'verification_tokens' })
@Index('active_token_per_type', ['userId', 'type'], {
  unique: true,
  where: '"consumed_at" IS NULL',
})
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('enum', { enum: VerificationTokenType })
  type: VerificationTokenType;

  @Column('varchar')
  tokenHash: string;

  @Column('timestamptz')
  expiresAt: Date;

  @Column('timestamptz', { nullable: true })
  sentAt: Date | null;

  @Column('timestamptz', { nullable: true })
  consumedAt: Date | null;

  @ManyToOne(() => User, (u) => u.verificationTokens, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  isWithinCooldown(span: number) {
    return this.sentAt && Date.now() < this.sentAt.getTime() + span;
  }

  isExpired() {
    return this.expiresAt.getTime() < Date.now();
  }
}
