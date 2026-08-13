import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DeviceType } from '../../../shared/constants/device-types.constant';

export enum DeviceTokenProvider {
  FCM = 'fcm',
}

@Entity({ schema: 'notification', name: 'device_tokens' })
@Unique(['provider', 'token'])
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string | null;

  @Column({ type: 'enum', enum: DeviceTokenProvider })
  provider: DeviceTokenProvider;

  @Column()
  token: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'varchar', nullable: true })
  deviceId: string | null;

  @Column({ type: 'varchar', nullable: true })
  deviceType: DeviceType | null;

  @Column({ type: 'varchar', nullable: true })
  deviceName: string | null;

  @ManyToOne(() => User, (u) => u.notificationDeviceTokens, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
