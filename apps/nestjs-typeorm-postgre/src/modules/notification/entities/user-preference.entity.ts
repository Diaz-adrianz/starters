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
import { DeliveryChannel } from './delivery.entity';

export type UserPreferenceChannels = Record<DeliveryChannel, boolean>;

@Entity({ schema: 'notification', name: 'user_preferences' })
@Unique(['userId', 'category'])
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  category: string;

  @Column({ type: 'jsonb' })
  channels: UserPreferenceChannels;

  @Column({ type: 'time', nullable: true })
  quietHoursStartAt: string | null;

  @Column({ type: 'time', nullable: true })
  quietHoursEndAt: string | null;

  @Column({ type: 'varchar', nullable: true })
  timezone: string | null;

  @ManyToOne(() => User, (u) => u.notificationPreferences, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
