import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import {
  ResourceScope,
  ResourceScopePageOptions,
} from '../../shared/classes/resource-scope.class';
import { repoSelect } from '../../shared/utils/typeorm/repo-select.util';
import { AppRepository } from '../../database/typeorm/app-repository';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification, 'default')
    private notificationRepo: AppRepository<Notification>,
  ) {}

  markRead(scope: ResourceScope) {
    scope.add({ isnull: 'readAt' });
    return this.notificationRepo.update(scope.where, {
      readAt: new Date(),
    });
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  findMany(options: ResourceScopePageOptions) {
    return this.notificationRepo.findAndCount({
      ...options,
      relations: { user: true, message: true },
      select: {
        ...repoSelect(this.notificationRepo, ['id', 'readAt', 'createdAt']),
        message: {
          id: true,
          category: true,
          title: true,
          body: true,
          data: true,
          createdAt: true,
        },
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  delete(scope: ResourceScope) {
    return this.notificationRepo.delete(scope.where);
  }
}
