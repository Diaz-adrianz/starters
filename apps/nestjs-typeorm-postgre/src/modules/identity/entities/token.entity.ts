import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TokenType } from '../enums/token-type.enum';
import { Exclude } from 'class-transformer';

@Entity({ schema: 'identity', name: 'tokens' })
@Index('active_token_per_type', ['userId', 'type'], {
  unique: true,
  where: '"consumed_at" IS NULL',
})
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('enum', { enum: TokenType })
  type: TokenType;

  @Exclude({ toPlainOnly: true })
  @Column('varchar')
  hash: string;

  @Column('timestamptz')
  expiresAt: Date;

  @Column('timestamptz')
  refreshedAt: Date;

  @Column('timestamptz', { nullable: true })
  consumedAt: Date | null;

  @ManyToOne(() => User, (u) => u.tokens, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  isFresh(span: number) {
    return Date.now() < this.refreshedAt.getTime() + span;
  }

  isExpired() {
    return this.expiresAt.getTime() < Date.now();
  }
}
