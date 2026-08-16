import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DeviceType } from '../../../shared/constants/device-types.constant';
import { PushProvider } from '../enums/push-provider.enum';

@Entity({ schema: 'notification', name: 'push_tokens' })
@Unique(['provider', 'token'])
export class PushToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { enum: PushProvider })
  provider: PushProvider;

  @Column('varchar')
  token: string;

  @Column('bool', { default: true })
  enabled: boolean;

  @Column('varchar', { nullable: true })
  userId: string | null;

  @Column('varchar', { nullable: true })
  deviceId: string | null;

  @Column('varchar', { nullable: true })
  deviceType: DeviceType | null;

  @Column('varchar', { nullable: true })
  deviceName: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
