import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../database/database-keys.constant';
import { RoleUser } from './entities/role-user.entity';
import { CacheService } from '../../infra/cache/cache.service';
import { LoggerService } from '../../infra/logger/logger.service';
import { HOUR } from '../../shared/utils/number.util';
import { RolePermission } from './entities/role-permission.entity';
import { RolePage } from './entities/role-page.entity';
import { Condition } from './interfaces/condition.interface';

type UserRolesCache = { id: string; name: string }[];

type RolePermissionsCache = { key: string; condition: Condition | null }[];

type RolePagesCache = { name: string }[];

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(RoleUser, DatabaseKeys.DEFAULT)
    private roleUserRepo: AppRepository<RoleUser>,
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: AppRepository<RolePermission>,
    @InjectRepository(RolePage, DatabaseKeys.DEFAULT)
    private rolePagesRepo: AppRepository<RolePage>,
    private cache: CacheService,
    private logger: LoggerService,
  ) {}

  async findUserAccesses(userId: string) {
    const roles = await this.findUserActiveRoles(userId),
      permissions = await Promise.all(
        roles.map((role) => this.findRoleActivePermissions(role.id)),
      ),
      pages = await Promise.all(
        roles.map((role) => this.findRoleActivePages(role.id)),
      );

    return {
      roles: roles.map((r) => r.name),
      permissions: permissions.flat().map((p) => p.key),
      pages: pages.flat().map((p) => p.name),
    };
  }

  async validateUserRoles(userId: string, roleNames: string[]) {
    const roles = await this.findUserActiveRoles(userId);
    return roles.some((role) => roleNames.includes(role.name)) ? roles : null;
  }

  async validateUserPermission(userId: string, key: string) {
    const roles = await this.findUserActiveRoles(userId);

    const conditions: (Condition | null)[] = [];
    for (const role of roles) {
      const permissions = await this.findRoleActivePermissions(role.id);
      permissions.forEach((p) => {
        if (p.key === key) conditions.push(p.condition);
      });
    }

    return conditions.length ? conditions : null;
  }

  // Utils
  // ----------------------------------------------------------------
  private async findUserActiveRoles(userId: string) {
    let roles = await this.cache.get<UserRolesCache>((k) =>
      k.userRoles(userId),
    );

    if (!roles) {
      this.logger.debug('User roles cache missed', this.constructor.name);
      const userRoles = await this.roleUserRepo.find({
        where: { userId, role: { enabled: true } },
        relations: { role: true },
      });

      roles = userRoles.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
      }));
      await this.cache.set((k) => k.userRoles(userId), roles, 1 * HOUR);
    }

    return roles;
  }

  private async findRoleActivePermissions(roleId: string) {
    let permissions = await this.cache.get<RolePermissionsCache>((k) =>
      k.rolePermissions(roleId),
    );

    if (!permissions) {
      this.logger.debug('Role permissions cache missed', this.constructor.name);
      const rolePermissions = await this.rolePermissionRepo.find({
        where: { roleId, permission: { enabled: true } },
        relations: { permission: true },
      });

      permissions = rolePermissions.map(({ permission, condition }) => ({
        key: `${permission.module}:${permission.resource}:${permission.action}`,
        condition: condition,
      }));
      await this.cache.set(
        (k) => k.rolePermissions(roleId),
        permissions,
        1 * HOUR,
      );
    }

    return permissions;
  }

  private async findRoleActivePages(roleId: string) {
    let pages = await this.cache.get<RolePagesCache>((k) =>
      k.rolePages(roleId),
    );

    if (!pages) {
      this.logger.debug('Role pages cache missed', this.constructor.name);
      const rolePages = await this.rolePagesRepo.find({
        where: { roleId, page: { enabled: true } },
        relations: { page: true },
      });

      pages = rolePages.map(({ page }) => ({
        name: page.name,
      }));
      await this.cache.set((k) => k.rolePages(roleId), pages, 1 * HOUR);
    }

    return pages;
  }
}
