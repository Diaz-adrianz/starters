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
@Unique(['deviceId', 'channel'])
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceId: string;

  @Column({ type: 'enum', enum: DeviceTokenChannel })
  channel: DeviceTokenChannel;

  @Column({ nullable: true })
  userId: string | null;

  @Column()
  token: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (u) => u.notificationPreferences, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
