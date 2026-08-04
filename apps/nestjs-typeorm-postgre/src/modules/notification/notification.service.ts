import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { Recipient } from './entities/recipient.entity';

@Injectable()
export class NotificationService {
  constructor(@InjectDataSource('default') private datasource: DataSource) {}

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
}
