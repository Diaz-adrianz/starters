import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipient } from '../entities/recipient.entity';
import { Repository } from 'typeorm';
import { ResourceScopePageOptions } from '../../../shared/classes/resource-scope.class';
import { ServiceBase } from '../../../common/classes/base/service.base';

@Injectable()
export class RecipientService extends ServiceBase<Recipient> {
  constructor(
    @InjectRepository(Recipient)
    private recipientRepo: Repository<Recipient>,
  ) {
    super(recipientRepo);
  }

  findAll(options: ResourceScopePageOptions) {
    return this.recipientRepo.findAndCount({
      ...options,
      relations: { user: true, notification: true },
      select: {
        ...this.select(['id', 'readAt', 'createdAt']),
        notification: { id: true, category: true, title: true, body: true },
        user: { id: true, username: true, avatar: true },
      },
    });
  }
}
