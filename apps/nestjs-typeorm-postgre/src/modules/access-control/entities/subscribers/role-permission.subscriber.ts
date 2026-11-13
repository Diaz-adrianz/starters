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
import { RolePermission } from '../role-permission.entity';

@Injectable()
export class RolePermissionSubscriber implements EntitySubscriberInterface<RolePermission> {
  private name = this.constructor.name;

  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource,
    private service: AccessControlService,
    private logger: LoggerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return RolePermission;
  }

  async afterInsert(e: InsertEvent<RolePermission>) {
    await this.service.invalidateRoles([{ id: e.entity.roleId }]);
    this.logger.debug(
      `Roles invalidated on rolePermission.created: ${e.entity.roleId}`,
      this.name,
    );
  }

  async afterRemove(e: RemoveEvent<RolePermission>) {
    if (e.databaseEntity) {
      await this.service.invalidateRoles([{ id: e.databaseEntity.roleId }]);
      this.logger.debug(
        `Roles invalidated on rolePermission.deleted: ${e.databaseEntity.roleId}`,
        this.name,
      );
    }
  }
}
