import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntitySubscriberInterface } from 'typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { RolePermission } from '../role-permission.entity';

@Injectable()
export class RolePermissionSubscriber implements EntitySubscriberInterface<RolePermission> {
  constructor(@InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return RolePermission;
  }
}
