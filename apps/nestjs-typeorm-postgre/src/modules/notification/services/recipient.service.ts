import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipient } from '../entities/recipient.entity';
import { Repository } from 'typeorm';
import { ResourceScopePageOptions } from '../../../shared/classes/resource-scope.class';
import { repoSelect } from '../../../shared/utils/typeorm/repo-select.util';

@Injectable()
export class RecipientService {
  constructor(
    @InjectRepository(Recipient)
    private recipientRepo: Repository<Recipient>,
  ) {}

  findMany(options: ResourceScopePageOptions) {
    return this.recipientRepo.findAndCount({
      ...options,
      relations: { user: true },
      select: {
        ...repoSelect(this.recipientRepo, [
          'id',
          'readAt',
          'createdAt',
          'notificationId',
        ]),
        user: { id: true, username: true, avatar: true },
      },
    });
  }
}
