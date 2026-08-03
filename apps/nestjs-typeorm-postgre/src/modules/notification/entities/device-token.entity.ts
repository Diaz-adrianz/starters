import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DeviceTokenChannel {
  FCM = 'fcm',
}

@Entity({ schema: 'notification', name: 'device_tokens' })
@Unique(['userId', 'channel', 'token'])
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: DeviceTokenChannel })
  channel: DeviceTokenChannel;

  @Column()
  token: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (u) => u.notificationPreferences, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
