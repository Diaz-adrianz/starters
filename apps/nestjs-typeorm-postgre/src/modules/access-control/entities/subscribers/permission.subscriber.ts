import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AccessControlService } from '../../access-control.service';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { Permission } from '../permission.entity';
import { RolePermission } from '../role-permission.entity';

@Injectable()
export class PermissionSubscriber implements EntitySubscriberInterface<Permission> {
  private name = this.constructor.name;

  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) dataSource: DataSource,
    private service: AccessControlService,
    private logger: LoggerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Permission;
  }

  async afterUpdate(e: UpdateEvent<Permission>) {
    const entity = e.entity ? (e.entity as Partial<Permission>) : undefined;

    if (entity?.id) {
      const rolePermissions = await e.manager
        .getRepository(RolePermission)
        .find({
          where: { permissionId: entity.id },
          select: { roleId: true },
          withDeleted: true,
        });

      if (rolePermissions.length) {
        const roleIds = rolePermissions.map((rp) => ({ id: rp.roleId }));
        await this.service.invalidateRoles(roleIds);
        this.logger.debug(
          `Permissions invalidated on permission.updated: ${roleIds.map((r) => r.id).join(', ')}`,
          this.name,
        );
      }
    }
  }
}
