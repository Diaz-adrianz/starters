import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../../entities/message.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { TemplateService } from '../template/template.service';
import { Channel } from '../../enums/channel.enum';
import { NotificationGateway } from '../../notification.gateway';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { Repository } from 'typeorm';
import { ResourceService } from '../../../../common/services/resource.service';

@Injectable()
export class MessageService extends ResourceService<Message> {
  constructor(
    @InjectRepository(Message, DatabaseKeys.DEFAULT)
    private messageRepo: Repository<Message>,
    private templateService: TemplateService,
    private gateway: NotificationGateway,
  ) {
    super(messageRepo);
  }

  count(rq: ResourceQuery) {
    return this.messageRepo.count(rq.toFindOptions());
  }

  markRead(rq: ResourceQuery) {
    rq.add([['readAt', 'eq', null]]);
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

    const res = await this.messageRepo.save(messages);

    messages.forEach((message) =>
      this.gateway.emitToUser(message.userId, 'message.created', {
        id: message.id,
        title: message.title,
        body: message.body,
      }),
    );

    return res;
  }

  // Base
  // ----------------------------------------------------------------
  async findMany(rq: ResourceQuery) {
    return this.messageRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { delivery: true },
      select: {
        ...this.select('*'),
        delivery: {
          id: true,
          type: true,
        },
      },
    });
  }

  async delete(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions());
    return this.messageRepo.remove(data);
  }
}
