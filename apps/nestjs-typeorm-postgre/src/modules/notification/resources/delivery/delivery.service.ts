import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { Delivery } from '../../entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
import { InjectQueue } from '@nestjs/bullmq';
import {
  PUSHDELIVERY_QUEUE,
  type PushDeliveryQueue,
} from '../../queue/push-delivery/push-delivery.contract';
import { Channel } from '../../enums/channel.enum';
import { Injectable } from '@nestjs/common';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery, DatabaseKeys.DEFAULT)
    private deliveryRepo: AppRepository<Delivery>,
    @InjectQueue(PUSHDELIVERY_QUEUE)
    private pushDeliveryQueue: PushDeliveryQueue,
  ) {}

  retry() {}

  // ================================================================
  // Basic CRUD DeliveryLog
  // ----------------------------------------------------------------
  findManyLog() {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  async create(dto: CreateDeliveryDto) {
    const delivery = await this.deliveryRepo.save({
      type: dto.type,
      templateKey: dto.templateKey,
    });

    for (const channel of dto.channels) {
      if (channel === Channel.PUSH) {
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
      }
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
