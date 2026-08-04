import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipient } from '../entities/recipient.entity';
import { Repository } from 'typeorm';
import { ResourceScopePageOptions } from '../../../shared/classes/resource-scope.class';

@Injectable()
export class RecipientService {
  constructor(
    @InjectRepository(Recipient)
    private recipientRepo: Repository<Recipient>,
  ) {}

  findAll(options: ResourceScopePageOptions) {
    return this.recipientRepo.findAndCount({
      ...options,
      relations: { ...options.relations, notification: true },
      select: {
        id: true,
        userId: true,
        readAt: true,
        notification: {
          id: true,
          category: true,
          title: true,
          body: true,
          data: true,
        },
      },
    });
  }
}
