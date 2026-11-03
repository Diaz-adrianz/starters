import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { UserStatus } from '../enums/user-status.enum';
import { Token } from './token.entity';

@Entity({ schema: 'identity', name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  username: string;

  @Column('varchar', { unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column('varchar', { nullable: true })
  password?: string | null;

  @Column('enum', { enum: UserStatus })
  status: UserStatus;

  @Column('varchar', { nullable: true })
  avatar?: string | null;

  @OneToOne(() => Profile, (p) => p.user)
  profile: Profile | null;

  @OneToMany(() => Token, (t) => t.user)
  tokens: Token[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
