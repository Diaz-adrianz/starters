import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CacheService } from '../../../infra/cache/cache.service';
import {
  AccessControlEventName,
  AccessControlEventPayload,
} from '../../../infra/event/interfaces/access-control-event.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from '../entities/role-permission.entity';
import { AppRepository } from '../../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../../database/database-keys.contant';
import { In } from 'typeorm';

@Injectable()
export class AccessControlEventSubscriber {
  constructor(
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: AppRepository<RolePermission>,
    private cache: CacheService,
  ) {}

  @OnEvent(AccessControlEventName.ACCESSCONTROL_ROLE_UPDATED)
  async roleUpdated(
    payload: AccessControlEventPayload['accessControl.role.updated'],
  ) {
    await this.invalidateRoles(payload.roles);
  }

  @OnEvent(AccessControlEventName.ACCESSCONTROL_ROLE_DELETED)
  async roleDeleted(
    payload: AccessControlEventPayload['accessControl.role.deleted'],
  ) {
    await this.invalidateRoles(payload.roles);
  }

  @OnEvent(AccessControlEventName.ACCESSCONTROL_PERMISSION_UPDATED)
  async permissionUpdated(
    payload: AccessControlEventPayload['accessControl.permission.updated'],
  ) {
    const rolePermissions = await this.rolePermissionRepo.find({
      where: { permission: In(payload.permissions.map((p) => p.id)) },
      select: { roleId: true },
    });
    await this.invalidateRoles(
      rolePermissions.map((rp) => ({ id: rp.roleId })),
    );
  }

  // Utils
  // ----------------------------------------------------------------
  invalidateRoles(roles: { id: string }[]) {
    return this.cache.delMany((k) =>
      roles.map((role) => k.rolePermissions(role.id)),
    );
  }
}
