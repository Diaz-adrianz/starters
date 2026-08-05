import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { Recipient } from './entities/recipient.entity';
import { BaseService } from '../../common/classes/base/service.base';
import {
  ResourceScopeOptions,
  ResourceScopePageOptions,
} from '../../shared/classes/resource-scope.class';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    @InjectDataSource('default') private datasource: DataSource,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {
    super(notificationRepo);
  }

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
    return this.notificationRepo.findAndCount(options);
  }

  findOne(options: ResourceScopeOptions) {
    return this.notificationRepo.findOneOrFail(options);
  }
}
