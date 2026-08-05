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
import { UserRole } from './user-role.entity';
import { Recipient as NotificationRecipient } from '../../notification/entities/recipient.entity';
import { UserPreference as NotificationPreference } from '../../notification/entities/user-preference.entity';
import { DeviceToken as NotificationDeviceToken } from '../../notification/entities/device-token.entity';

@Entity({ schema: 'auth', name: 'users' })
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

  // Notification
  @OneToMany(() => NotificationRecipient, (nr) => nr.user)
  notifications: NotificationRecipient[];

  @OneToMany(() => NotificationPreference, (np) => np.user)
  notificationPreferences: NotificationPreference[];

  @OneToMany(() => NotificationDeviceToken, (ndt) => ndt.user)
  notificationDeviceTokens: NotificationDeviceToken[];
  // ------------

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;

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
