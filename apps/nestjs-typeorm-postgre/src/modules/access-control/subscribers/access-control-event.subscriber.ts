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
import { LoggerService } from '../../../infra/logger/logger.service';

@Injectable()
export class AccessControlEventSubscriber {
  private name = 'access-control/' + this.constructor.name;

  constructor(
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: AppRepository<RolePermission>,
    private accessControlService: AccessControlService,
    private logger: LoggerService,
  ) {}

  @OnEvent(AccessControlEventName.ROLE_UPDATED)
  async roleUpdated(
    payload: AccessControlEventPayload['accessControl.role.updated'],
  ) {
    await this.invalidateRoles(payload.target);
    this.logger.debug(
      `Roles invalidated on role.updated: ${payload.target.map((t) => t.id).join(', ')}`,
      this.name,
    );
  }

  @OnEvent(AccessControlEventName.ROLE_DELETED)
  async roleDeleted(
    payload: AccessControlEventPayload['accessControl.role.deleted'],
  ) {
    await this.invalidateRoles(payload.target);
    this.logger.debug(
      `Roles invalidated on role.deleted: ${payload.target.map((t) => t.id).join(', ')}`,
      this.name,
    );
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
    await this.invalidateRoles(
      rolePermissions.map((rp) => ({ id: rp.roleId })),
    );
    this.logger.debug(
      `Roles invalidated on permission.updated: ${payload.target.map((t) => t.id).join(', ')}`,
      this.name,
    );
  }

  @OnEvent(AccessControlEventName.ROLE_USER_CREATED)
  async roleUserCreated(
    payload: AccessControlEventPayload['accessControl.roleUser.created'],
  ) {
    await this.invalidateUsers([{ id: payload.userId }]);
    this.logger.debug(
      `Users invalidated on roleUser.created: ${payload.userId}`,
      this.name,
    );
  }

  @OnEvent(AccessControlEventName.ROLE_USER_DELETED)
  async roleUserDeleted(
    payload: AccessControlEventPayload['accessControl.roleUser.deleted'],
  ) {
    await this.invalidateUsers(payload.map((p) => ({ id: p.userId })));
    this.logger.debug(
      `Users invalidated on roleUser.updated: ${payload.map((p) => p.userId).join(', ')}`,
      this.name,
    );
  }

  @OnEvent(AccessControlEventName.ROLE_PERMISSION_CREATED)
  async rolePermissionCreated(
    payload: AccessControlEventPayload['accessControl.rolePermission.created'],
  ) {
    await this.invalidateRoles([{ id: payload.roleId }]);
    this.logger.debug(
      `Roles invalidated on rolePermission.updated: ${payload.roleId}`,
      this.name,
    );
  }

  @OnEvent(AccessControlEventName.ROLE_PERMISSION_DELETED)
  async rolePermissionDeleted(
    payload: AccessControlEventPayload['accessControl.rolePermission.deleted'],
  ) {
    await this.invalidateRoles(payload.map((p) => ({ id: p.roleId })));
    this.logger.debug(
      `Roles invalidated on rolePermission.deleted: ${payload.map((p) => p.roleId).join(',')}`,
      this.name,
    );
  }

  private async invalidateRoles(roles: { id: string }[]) {
    try {
      await this.accessControlService.invalidateRoles(roles);
    } catch (error) {
      this.logger.error(
        `Failed to invalidate roles ${roles.map((u) => u.id).join(', ')}`,
        error,
        this.name,
      );
    }
  }

  private async invalidateUsers(users: { id: string }[]) {
    try {
      await this.accessControlService.invalidateUsers(users);
    } catch (error) {
      this.logger.error(
        `Failed to invalidate users ${users.map((u) => u.id).join(', ')}`,
        error,
        this.name,
      );
    }
  }
}
