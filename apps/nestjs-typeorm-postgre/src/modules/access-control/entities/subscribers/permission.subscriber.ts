import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntitySubscriberInterface } from 'typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { Permission } from '../permission.entity';

@Injectable()
export class PermissionSubscriber implements EntitySubscriberInterface<Permission> {
  constructor(@InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Permission;
  }
}
