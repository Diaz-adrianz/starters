import { ObjectLiteral, Repository } from 'typeorm';
import { ResourceScope } from '../../../shared/classes/resource-scope.class';
import { NotFoundException } from '@nestjs/common';

export class BaseService<T extends ObjectLiteral> {
  constructor(protected repo: Repository<T>) {}

  findByScope(scope: ResourceScope) {
    return this.repo.find(scope.toOptions());
  }

  findOneByScope(scope: ResourceScope) {
    return this.repo.findOneOrFail(scope.toOptions());
  }

  countByScope(scope: ResourceScope) {
    return this.repo.count(scope.toOptions());
  }

  async existByScope(scope: ResourceScope) {
    const exist = await this.repo.exists(scope.toOptions());
    if (!exist) throw new NotFoundException('Entry not found');
  }
}
