import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AccessControlService } from '../../access-control.service';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { RoleUser } from '../role-user.entity';

@Injectable()
export class RoleUserSubscriber implements EntitySubscriberInterface<RoleUser> {
  private name = this.constructor.name;

  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource,
    private service: AccessControlService,
    private logger: LoggerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return RoleUser;
  }

  async afterInsert(e: InsertEvent<RoleUser>) {
    await this.service.invalidateUsers([{ id: e.entity.userId }]);
    this.logger.debug(
      `Users invalidated on roleUser.created: ${e.entity.userId}`,
      this.name,
    );
  }

  async afterRemove(e: RemoveEvent<RoleUser>) {
    if (e.databaseEntity) {
      await this.service.invalidateUsers([{ id: e.databaseEntity.userId }]);
      this.logger.debug(
        `Users invalidated on roleUser.deleted: ${e.databaseEntity.userId}`,
        this.name,
      );
    }
  }
}
