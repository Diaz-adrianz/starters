import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DeviceType } from '../../../shared/constants/device-types.constant';
import { DeviceTokenProvider } from '../enums/device-token-provider.enum';

@Entity({ schema: 'notification', name: 'device_tokens' })
@Unique(['provider', 'token'])
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
