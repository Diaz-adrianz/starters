import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  RecoverEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { Role } from '../role.entity';
import { AccessControlService } from '../../access-control.service';
import { LoggerService } from '../../../../infra/logger/logger.service';

@Injectable()
export class RoleSubscriber implements EntitySubscriberInterface<Role> {
  private name = this.constructor.name;

  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource,
    private service: AccessControlService,
    private logger: LoggerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Role;
  }

  async afterUpdate(e: UpdateEvent<Role>) {
    const entity = e.entity ? (e.entity as Partial<Role>) : undefined;

    if (entity?.id) {
      await this.service.invalidateRoles([{ id: entity.id }]);
      this.logger.debug(
        `Roles invalidated on role.updated: ${entity.id}`,
        this.name,
      );
    }
  }

  async afterSoftRemove(e: SoftRemoveEvent<Role>) {
    if (e.databaseEntity.id) {
      await this.service.invalidateRoles([{ id: e.databaseEntity.id }]);
      this.logger.debug(
        `Roles invalidated on role.archived: ${e.databaseEntity.id}`,
        this.name,
      );
    }
  }

  async afterRecover(e: RecoverEvent<Role>) {
    await this.service.invalidateRoles([{ id: e.databaseEntity.id }]);
    this.logger.debug(
      `Roles invalidated on role.restored: ${e.databaseEntity.id}`,
      this.name,
    );
  }

  async afterRemove(e: RemoveEvent<Role>) {
    if (e.databaseEntity?.id) {
      await this.service.invalidateRoles([{ id: e.databaseEntity.id }]);
      this.logger.debug(
        `Roles invalidated on role.deleted: ${e.databaseEntity.id}`,
        this.name,
      );
    }
  }
}
