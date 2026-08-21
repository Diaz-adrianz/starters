import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../access-control/entities/user-role.entity';
import { VerificationToken } from './verification-token.entity';

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

  @Column('bool', { default: false })
  enabled: boolean;

  @Column('varchar', { nullable: true })
  avatar?: string | null;

  @Column('timestamptz', { nullable: true })
  verifiedAt?: Date | null;

  @OneToMany(() => VerificationToken, (ur) => ur.user)
  verificationTokens: VerificationToken[];

  // Access control
  @OneToMany(() => UserRole, (ur) => ur.user)
  roles: UserRole[];
  // ---------------------------------

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  isActive(): boolean {
    return this.enabled && !!this.verifiedAt;
  }
}
