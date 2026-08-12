import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Notification } from '../entities/notification.entity';
import { ResourceScope } from '../../../shared/classes/resource-scope.class';
import { AppRepository } from '../../../database/typeorm/app-repository';
import { AppDataSource } from '../../../database/typeorm/app-data-source';
import { DatabaseKeys } from '../../../database/database-keys.contant';

@Injectable()
export class MessageService {
  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    @InjectRepository(Message, DatabaseKeys.DEFAULT)
    private messageRepo: AppRepository<Message>,
  ) {}
  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  async create(createMessageDto: CreateMessageDto) {
    const { userIds, ...payload } = createMessageDto;

    const data = await this.dataSource.transaction(async (manager) => {
      const message = manager.create(Message, payload);

      await manager.save(message);
      await manager.insert(
        Notification,
        userIds.map((userId) => ({
          userId,
          messageId: message.id,
        })),
      );

      return message;
    });
    return data;
  }

  findMany(scope: ResourceScope) {
    return this.messageRepo.findAndCount({
      ...scope.toPageOptions(),
      select: {
        id: true,
        category: true,
        title: true,
        body: true,
        data: true,
        createdAt: true,
      },
    });
  }

  findOne(scope: ResourceScope) {
    return this.messageRepo.findOneOrFail({
      ...scope.toOptions(),
    });
  }

  archive(scope: ResourceScope) {
    return this.messageRepo.softDelete(scope.where);
  }

  restore(scope: ResourceScope) {
    return this.messageRepo.restore(scope.where);
  }

  delete(scope: ResourceScope) {
    return this.messageRepo.delete(scope.where);
  }
}
