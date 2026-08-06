import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import {
  ResourceScope,
  ResourceScopeOptions,
  ResourceScopePageOptions,
  VALUES_SEPARATOR,
} from '../../shared/classes/resource-scope.class';
import { Message } from './entities/message.entity';
import { repoSelect } from '../../shared/utils/typeorm/repo-select.util';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectDataSource('default') private datasource: DataSource,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  // ================================================================
  // Create
  // ----------------------------------------------------------------
  async create(createNotificationDto: CreateNotificationDto) {
    const data = await this.datasource.transaction(async (manager) => {
      const message = manager.create(Message, createNotificationDto.message);

      await manager.save(message);
      await manager.insert(
        Notification,
        createNotificationDto.users.map((user) => ({
          userId: user.id,
          messageId: message.id,
        })),
      );

      return message;
    });

    return data;
  }

  // ================================================================
  // Read
  // ----------------------------------------------------------------
  findMany(options: ResourceScopePageOptions) {
    return this.notificationRepo.findAndCount({
      ...options,
      relations: { user: true, message: true },
      select: {
        ...repoSelect(this.notificationRepo, ['id', 'readAt', 'createdAt']),
        message: repoSelect(this.messageRepo, [
          'id',
          'category',
          'title',
          'body',
          'data',
          'createdAt',
        ]),
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  findOne(options: ResourceScopeOptions) {
    return this.notificationRepo.findOneOrFail({
      ...options,
      relations: { user: true, message: true },
      select: {
        ...repoSelect(this.notificationRepo, '*'),
        message: repoSelect(this.messageRepo, [
          'id',
          'category',
          'title',
          'body',
          'data',
          'createdAt',
        ]),
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  // ================================================================
  // Update
  // ----------------------------------------------------------------
  markAsRead(scope: ResourceScope, markAsReadDto: MarkAsReadDto) {
    const { notificationIds, isRead } = markAsReadDto;
    scope.add({
      in: `id:${notificationIds.join(VALUES_SEPARATOR)}`,
      isnull: isRead ? 'readAt' : undefined,
    });

    return this.notificationRepo.update(scope.toOptions().where, {
      readAt: isRead ? new Date() : null,
    });
  }

  // ================================================================
  // Update
  // ----------------------------------------------------------------
  delete(scope: ResourceScope) {
    return this.notificationRepo.delete(scope.where);
  }
}
