import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { Delivery } from '../../entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
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

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery, DatabaseKeys.DEFAULT)
    private deliveryRepo: AppRepository<Delivery>,
    @InjectRepository(DeliveryLog, DatabaseKeys.DEFAULT)
    private deliveryLogRepo: AppRepository<DeliveryLog>,
    @InjectQueue(PUSH_DELIVERY_QUEUE)
    private pushDeliveryQueue: PushDeliveryQueue,
    @InjectQueue(EMAIL_DELIVERY_QUEUE)
    private emailDeliveryQueue: EmailDeliveryQueue,
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
    const delivery = await this.deliveryRepo.save({
      type: dto.type,
      priority: dto.priority,
      templateKey: dto.templateKey,
    });

    for (const channel of dto.channels) {
      if (channel === Channel.PUSH)
        await this.pushDeliveryQueue.addBulk(
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
            })),
        );
      else if (channel === Channel.EMAIL)
        await this.emailDeliveryQueue.addBulk(
          dto.recipients
            .filter((r): r is typeof r & { email: string } => !!r.email)
            .map((r) => ({
              name: 'send-to-email',
              data: {
                deliveryId: delivery.id,
                templateKey: delivery.templateKey,
                email: r.email,
                payload: r.payload,
              },
            })),
        );
    }
    return delivery;
  }

  findMany(scope: ResourceScope) {
    return this.deliveryRepo.findAndCount({
      ...scope.toPageOptions(),
    });
  }

  findOne(scope: ResourceScope) {
    return this.deliveryRepo.findOneOrFail({
      ...scope.toOptions(),
    });
  }

  delete() {}
}
