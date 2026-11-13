import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntitySubscriberInterface } from 'typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { RoleUser } from '../role-user.entity';

@Injectable()
export class RoleUserSubscriber implements EntitySubscriberInterface<RoleUser> {
  constructor(@InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return RoleUser;
  }
}
