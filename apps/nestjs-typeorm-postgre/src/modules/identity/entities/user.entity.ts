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

@Entity({ schema: 'identity', name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', nullable: true })
  password?: string | null;

  @Column({ default: false })
  enabled: boolean;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  verificationSentAt?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  resetPasswordSentAt?: Date | null;

  @OneToMany(() => UserRole, (ur) => ur.user)
  roles: UserRole[];

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
