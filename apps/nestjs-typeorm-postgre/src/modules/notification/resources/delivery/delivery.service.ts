import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { Delivery } from '../../entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { InjectQueue } from '@nestjs/bullmq';
import {
  PUSH_DELIVERY_QUEUE,
  type PushDeliveryQueue,
} from '../../queue/push-delivery/push-delivery.config';
import { Channel } from '../../enums/channel.enum';
import { Injectable } from '@nestjs/common';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { CreateDeliveryLogDto } from './dto/create-delivery-log.dto';
import { DeliveryLog } from '../../entities/delivery-log.entity';
import {
  EMAIL_DELIVERY_QUEUE,
  type EmailDeliveryQueue,
} from '../../queue/email-delivery/email-delivery.config';
import { DeliveryPriorityWeight } from '../../enums/delivery-priority.enum';
import { MessageService } from '../message/message.service';
import { LoggerService } from '../../../../infra/logger/logger.service';

@Injectable()
export class DeliveryService {
  constructor(
    private logger: LoggerService,
    @InjectRepository(Delivery, DatabaseKeys.DEFAULT)
    private deliveryRepo: AppRepository<Delivery>,
    @InjectRepository(DeliveryLog, DatabaseKeys.DEFAULT)
    private deliveryLogRepo: AppRepository<DeliveryLog>,
    @InjectQueue(PUSH_DELIVERY_QUEUE)
    private pushDeliveryQueue: PushDeliveryQueue,
    @InjectQueue(EMAIL_DELIVERY_QUEUE)
    private emailDeliveryQueue: EmailDeliveryQueue,
    private messageService: MessageService,
  ) {}

  retry() {}

  // ================================================================
  // Basic CRUD DeliveryLog
  // ----------------------------------------------------------------
  findManyLog() {}

  upsertLog(id: string, dto: CreateDeliveryLogDto) {
    return this.deliveryLogRepo.upsert(
      { deliveryId: id, ...dto },
      { conflictPaths: ['deliveryId', 'channel', 'recipient'] },
    );
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  async create(dto: CreateDeliveryDto) {
    const delivery = this.deliveryRepo.create({
      type: dto.type,
      priority: dto.priority,
      templateKey: dto.templateKey,
      sender: dto.sender,
    });
    await this.deliveryRepo.save(delivery);

    const dispatches: { channel: Channel; promise: Promise<any> }[] = [];

    if (dto.channels.includes(Channel.PUSH))
      dispatches.push({
        channel: Channel.PUSH,
        promise: this.pushDeliveryQueue.addBulk(
          dto.recipients
            .filter((r): r is typeof r & { userId: string } => !!r.userId)
            .map((r) => ({
              name: 'send-to-user',
              data: {
                deliveryId: delivery.id,
                templateKey: delivery.templateKey,
                userId: r.userId,
                payload: r.payload,
              },
              opts: { priority: DeliveryPriorityWeight[delivery.priority] },
            })),
        ),
      });
    if (dto.channels.includes(Channel.EMAIL))
      dispatches.push({
        channel: Channel.EMAIL,
        promise: this.emailDeliveryQueue.addBulk(
          dto.recipients
            .filter((r): r is typeof r & { email: string } => !!r.email)
            .map((r) => ({
              name: 'send-to-email',
              data: {
                deliveryId: delivery.id,
                templateKey: delivery.templateKey,
                email: r.email,
                payload: r.payload,
                sender:
                  delivery.sender?.name && delivery.sender?.email
                    ? {
                        name: delivery.sender.name,
                        email: delivery.sender.email,
                      }
                    : undefined,
                replyTo: delivery.sender?.emailReplyTo,
              },
              opts: { priority: DeliveryPriorityWeight[delivery.priority] },
            })),
        ),
      });

    if (dto.channels.includes(Channel.IN_APP))
      dispatches.push({
        channel: Channel.IN_APP,
        promise: this.messageService.createManyByDelivery(
          delivery.id,
          dto.templateKey,
          dto.recipients
            .filter((r): r is typeof r & { userId: string } => !!r.userId)
            .map((r) => ({
              userId: r.userId,
              payload: r.payload,
            })),
        ),
      });

    const results = await Promise.allSettled(dispatches.map((d) => d.promise));

    const failed = results
      .map((r, i) =>
        r.status === 'rejected'
          ? { channel: dispatches[i].channel, reason: String(r.reason) }
          : null,
      )
      .filter(Boolean);

    if (failed.length) {
      this.logger.warn(
        `Dispatch partially failed for delivery ${delivery.id}: ${failed.map((f) => `- ${f?.channel}: ${f?.reason}`).join('\n')}`,
        this.constructor.name,
      );
    }

    return delivery;
  }

  findMany(scope: ResourceScope) {
    return this.deliveryRepo.findAndCount({
      ...scope.toFindOptions(),
    });
  }

  findOne(scope: ResourceScope) {
    return this.deliveryRepo.findOneOrFail({
      ...scope.toFindOptions(),
    });
  }

  delete() {}
}
