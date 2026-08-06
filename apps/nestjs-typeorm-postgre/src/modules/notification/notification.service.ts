import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { Recipient } from './entities/recipient.entity';
import {
  ResourceScopeOptions,
  ResourceScopePageOptions,
} from '../../shared/classes/resource-scope.class';
import { repoSelect } from '../../shared/utils/typeorm/repo-select.util';

@Injectable()
export class NotificationService {
  constructor(
    @InjectDataSource('default') private datasource: DataSource,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
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

  findMany(options: ResourceScopePageOptions) {
    return this.notificationRepo.findAndCount({
      ...options,
      select: repoSelect(this.notificationRepo, [
        'id',
        'category',
        'title',
        'body',
        'data',
        'createdAt',
      ]),
    });
  }

  findOne(options: ResourceScopeOptions) {
    return this.notificationRepo.findOneOrFail(options);
  }
}
