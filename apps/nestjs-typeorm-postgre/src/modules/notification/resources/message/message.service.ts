import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../../entities/message.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { TemplateService } from '../template/template.service';
import { Channel } from '../../enums/channel.enum';
import { NotificationGateway } from '../../notification.gateway';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message, DatabaseKeys.DEFAULT)
    private messageRepo: AppRepository<Message>,
    private templateService: TemplateService,
    private gateway: NotificationGateway,
  ) {}

  count(rq: ResourceQuery) {
    return this.messageRepo.count(rq.toFindOptions());
  }

  markRead(rq: ResourceQuery) {
    rq.add([{ field: 'readAt', op: 'eq', value: null }]);
    return this.messageRepo.update(rq.toFindOptions().where, {
      readAt: new Date(),
    });
  }

  async createManyByDelivery(
    deliveryId: string,
    templateKey: string,
    recipients: { userId: string; payload: Record<string, any> }[],
  ) {
    const messages = this.messageRepo.create(
      await Promise.all(
        recipients.map(async (r) => {
          const rendered = await this.templateService.render(
            templateKey,
            Channel.IN_APP,
            r.payload,
          );
          return {
            deliveryId,
            userId: r.userId,
            title: rendered.title,
            body: rendered.body,
          };
        }),
      ),
    );

    await this.messageRepo.save(messages);

    messages.forEach((message) =>
      this.gateway.emitToUser(message.userId, 'message.created', {
        id: message.id,
        title: message.title,
        body: message.body,
      }),
    );

    return messages;
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  findMany(rq: ResourceQuery) {
    return this.messageRepo.findAndCount({
      ...rq.toFindOptions(),
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

  delete(rq: ResourceQuery) {
    return this.messageRepo.delete(rq.toFindOptions().where);
  }
}
