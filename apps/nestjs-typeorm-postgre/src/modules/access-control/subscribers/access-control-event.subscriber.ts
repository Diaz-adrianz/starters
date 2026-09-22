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
import { DatabaseKeys } from '../../../database/database-keys.constant';
import { In } from 'typeorm';
import { RolePage } from '../entities/role-page.entity';

@Injectable()
export class AccessControlEventSubscriber {
  constructor(
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: AppRepository<RolePermission>,
    @InjectRepository(RolePage, DatabaseKeys.DEFAULT)
    private rolePageRepo: AppRepository<RolePage>,
    private cache: CacheService,
  ) {}

  @OnEvent(AccessControlEventName.ROLE_UPDATED)
  async roleUpdated(
    payload: AccessControlEventPayload['accessControl.role.updated'],
  ) {
    await this.invalidateRoles(payload.target);
  }

  @OnEvent(AccessControlEventName.ROLE_DELETED)
  async roleDeleted(
    payload: AccessControlEventPayload['accessControl.role.deleted'],
  ) {
    await this.invalidateRoles(payload.target);
  }

  @OnEvent(AccessControlEventName.ROLE_USER_SET)
  async roleUserSet(
    payload: AccessControlEventPayload['accessControl.role.user_set'],
  ) {
    await this.invalidateUsers([{ id: payload.payload.userId }]);
  }

  @OnEvent(AccessControlEventName.ROLE_PERMISSION_SET)
  async rolePermissionSet(
    payload: AccessControlEventPayload['accessControl.role.permission_set'],
  ) {
    await this.invalidateRoles(payload.target);
  }

  @OnEvent(AccessControlEventName.ROLE_PAGE_SET)
  async rolePageSet(
    payload: AccessControlEventPayload['accessControl.role.page_set'],
  ) {
    await this.invalidateRoles(payload.target);
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
  }

  @OnEvent(AccessControlEventName.PAGE_UPDATED)
  async pageUpdated(
    payload: AccessControlEventPayload['accessControl.page.updated'],
  ) {
    const rolePages = await this.rolePageRepo.find({
      where: { page: In(payload.target.map((p) => p.id)) },
      select: { roleId: true },
      withDeleted: true,
    });
    await this.invalidateRoles(rolePages.map((rp) => ({ id: rp.roleId })));
  }

  @OnEvent(AccessControlEventName.PAGE_DELETED)
  async pageDeleted(
    payload: AccessControlEventPayload['accessControl.page.deleted'],
  ) {
    await this.invalidateRoles(
      payload.affected.roles.map((r) => ({ id: r.id })),
    );
  }

  // Utils
  // ----------------------------------------------------------------
  invalidateRoles(roles: { id: string }[]) {
    return this.cache.delMany((k) =>
      roles
        .map((role) => [k.rolePermissions(role.id), k.rolePages(role.id)])
        .flat(),
    );
  }

  invalidateUsers(users: { id: string }[]) {
    return this.cache.delMany((k) => users.map((user) => k.userRoles(user.id)));
  }
}
