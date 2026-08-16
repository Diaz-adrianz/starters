import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { DatabaseKeys } from '../../../database/database-keys.contant';
import { AppRepository } from '../../../database/typeorm/app-repository';
import {
  ResourceScope,
  ResourceScopePageOptions,
} from '../../../shared/classes/resource-scope.class';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message, DatabaseKeys.DEFAULT)
    private messageRepo: AppRepository<Message>,
  ) {}

  markRead(scope: ResourceScope) {
    scope.add({ isnull: 'readAt' });
    return this.messageRepo.update(scope.where, {
      readAt: new Date(),
    });
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  findMany(options: ResourceScopePageOptions) {
    return this.messageRepo.findAndCount({
      ...options,
      relations: { delivery: true },
      select: {
        ...this.messageRepo.select('*'),
        delivery: {
          id: true,
          type: true,
        },
      },
    });
  }

  delete(scope: ResourceScope) {
    return this.messageRepo.delete(scope.where);
  }
}
