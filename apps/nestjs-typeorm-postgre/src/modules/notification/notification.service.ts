import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { Recipient } from './entities/recipient.entity';
import { ResourceScopePageOptions } from '../../shared/classes/resource-scope.class';

@Injectable()
export class NotificationService {
  constructor(
    @InjectDataSource('default') private datasource: DataSource,
    @InjectRepository(Recipient) private recipientRepo: Repository<Recipient>,
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

  findAll(options: ResourceScopePageOptions) {
    return this.recipientRepo.findAndCount({
      ...options,
      relations: { ...options.relations, notification: true },
    });
  }
}
