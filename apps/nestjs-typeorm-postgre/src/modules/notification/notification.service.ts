import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { Recipient } from './entities/recipient.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectDataSource('default') private datasource: DataSource,
    @InjectRepository(DeviceToken)
    private deviceTokenRepo: Repository<DeviceToken>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { recipients, ...payload } = createNotificationDto;

    const data = await this.datasource.transaction(async (manager) => {
      const notification = manager.create(Notification, payload);

      await manager.save(notification);
      await manager.insert(
        Recipient,
        recipients.map((r) => ({ ...r, notificationId: notification.id })),
      );

      return notification;
    });

    return data;
  }

  // ================================================================
  // DeviceToken
  // ----------------------------------------------------------------
  createDeviceToken(
    deviceId: string,
    createDeviceTokenDto: CreateDeviceTokenDto,
    userId?: string | null,
  ) {
    return this.deviceTokenRepo.upsert(
      { deviceId, ...createDeviceTokenDto, userId },
      { conflictPaths: ['deviceId', 'channel'] },
    );
  }

  updateDeviceToken(
    deviceId: string,
    token: string,
    updateDeviceTokenDto: UpdateDeviceTokenDto,
  ) {
    return this.deviceTokenRepo.update(
      { deviceId, token },
      updateDeviceTokenDto,
    );
  }

  deleteDeviceToken(deviceId: string, token: string) {
    return this.deviceTokenRepo.delete({ deviceId, token });
  }
}
