import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { In } from 'typeorm';
import { ResourceScope } from '../../../shared/classes/resource-scope.class';
import {
  UpdateRoleDto,
  UpdateRolePermissionsAction,
} from '../dto/update-role.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RolePermission } from '../entities/role-permission.entity';
import { AppDataSource } from '../../../database/typeorm/app-data-source';
import { AppRepository } from '../../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../../database/database-keys.contant';
import { CacheService } from '../../../infra/cache/cache.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    @InjectRepository(Role, DatabaseKeys.DEFAULT)
    private roleRepo: AppRepository<Role>,
    private cache: CacheService,
  ) {}

  invalidateMany(roles: Pick<Role, 'id'>[]) {
    return this.cache.delMany((k) =>
      roles.map((role) => k.rolePermissions(role.id)),
    );
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  create(createRoleDto: CreateRoleDto) {
    return this.roleRepo.insert(createRoleDto);
  }

  findMany(scope: ResourceScope) {
    return this.roleRepo.findAndCount({
      ...scope.toPageOptions(),
      select: { id: true, name: true, isDefault: true },
    });
  }

  findOne(scope: ResourceScope) {
    return this.roleRepo.findOneOrFail({
      ...scope.toOptions(),
      relations: { permissions: { permission: true } },
      select: {
        ...this.roleRepo.select('*'),
        permissions: {
          id: true,
          createdAt: true,
          scope: true,
          permission: { id: true, group: true, description: true },
        },
      },
    });
  }

  async update(scope: ResourceScope, updateRoleDto: UpdateRoleDto) {
    const { permissions, ...payload } = updateRoleDto;

    const result = await this.dataSource.transaction(async (manager) => {
      const data = await manager.findOneOrFail(Role, scope.toOptions());
      const result = await manager.update(Role, scope.where, payload, {
        returning: ['id'],
      });

      if (permissions) {
        const { items, action } = permissions;

        if (action === UpdateRolePermissionsAction.SET) {
          await manager.delete(RolePermission, { roleId: data.id });
          await manager.insert(
            RolePermission,
            items.map((i) => ({
              roleId: data.id,
              permissionId: i.permissionId,
              scope: i.scope,
            })),
          );
        } else if (action === UpdateRolePermissionsAction.ADD)
          await manager.upsert(
            RolePermission,
            items.map((i) => ({
              roleId: data.id,
              permissionId: i.permissionId,
              scope: i.scope,
            })),
            ['roleId', 'permissionId'],
          );
        else if (action === UpdateRolePermissionsAction.REM)
          await manager.delete(RolePermission, {
            roleId: data.id,
            permissionId: In(items.map((i) => i.permissionId)),
          });
      }

      return result;
    });
    await this.invalidateMany(result.raw as Pick<Role, 'id'>[]);
    return result;
  }

  async archive(scope: ResourceScope) {
    const result = await this.roleRepo.softDelete(scope.where, {
      returning: ['id'],
    });
    await this.invalidateMany(result.raw as Pick<Role, 'id'>[]);
    return result;
  }

  async restore(scope: ResourceScope) {
    const result = await this.roleRepo.restore(scope.where, {
      returning: ['id'],
    });
    await this.invalidateMany(result.raw as Pick<Role, 'id'>[]);
    return result;
  }

  async delete(scope: ResourceScope) {
    const result = await this.roleRepo.delete(scope.where, {
      returning: ['id'],
    });
    await this.invalidateMany(result.raw as Pick<Role, 'id'>[]);
    return result;
  }
}
