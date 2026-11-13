import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntitySubscriberInterface } from 'typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { Role } from '../role.entity';

@Injectable()
export class RoleSubscriber implements EntitySubscriberInterface<Role> {
  constructor(@InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Role;
  }
}
