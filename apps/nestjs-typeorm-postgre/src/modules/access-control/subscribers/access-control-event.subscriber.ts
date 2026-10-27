import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AccessControlEventName,
  AccessControlEventPayload,
} from '../../../infra/event/interfaces/access-control-event.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from '../entities/role-permission.entity';
import { AppRepository } from '../../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../../database/database-keys.constant';
import { In } from 'typeorm';
import { AccessControlService } from '../access-control.service';

@Injectable()
export class AccessControlEventSubscriber {
  constructor(
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: AppRepository<RolePermission>,
    private accessControlService: AccessControlService,
  ) {}

  @OnEvent(AccessControlEventName.ROLE_UPDATED)
  async roleUpdated(
    payload: AccessControlEventPayload['accessControl.role.updated'],
  ) {
    await this.accessControlService.invalidateRoles(payload.target);
  }

  @OnEvent(AccessControlEventName.ROLE_DELETED)
  async roleDeleted(
    payload: AccessControlEventPayload['accessControl.role.deleted'],
  ) {
    await this.accessControlService.invalidateRoles(payload.target);
  }

  @OnEvent(AccessControlEventName.ROLE_USER_SET)
  async roleUserSet(
    payload: AccessControlEventPayload['accessControl.role.user_set'],
  ) {
    await this.accessControlService.invalidateUsers([
      { id: payload.payload.userId },
    ]);
  }

  @OnEvent(AccessControlEventName.ROLE_PERMISSION_SET)
  async rolePermissionSet(
    payload: AccessControlEventPayload['accessControl.role.permission_set'],
  ) {
    await this.accessControlService.invalidateRoles(payload.target);
  }

  @OnEvent(AccessControlEventName.PERMISSION_UPDATED)
  async permissionUpdated(
    payload: AccessControlEventPayload['accessControl.permission.updated'],
  ) {
    const rolePermissions = await this.rolePermissionRepo.find({
      where: { permission: In(payload.target.map((p) => p.id)) },
      select: { roleId: true },
      withDeleted: true,
    });
    await this.accessControlService.invalidateRoles(
      rolePermissions.map((rp) => ({ id: rp.roleId })),
    );
  }
}
