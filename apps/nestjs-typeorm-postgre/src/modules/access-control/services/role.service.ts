import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { In, Repository } from 'typeorm';
import { ResourceScope } from '../../../shared/classes/resource-scope.class';
import {
  UpdateRoleDto,
  UpdateRolePermissionsAction,
} from '../dto/update-role.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { repoSelect } from '../../../shared/utils/typeorm/repo-select.util';
import { DataSource } from 'typeorm';
import { RolePermission } from '../entities/role-permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource('default') private datasource: DataSource,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

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
        ...repoSelect(this.roleRepo, '*'),
        permissions: {
          id: true,
          createdAt: true,
          scope: true,
          permission: { id: true, group: true, description: true },
        },
      },
    });
  }

  update(scope: ResourceScope, updateRoleDto: UpdateRoleDto) {
    const { permissions, ...payload } = updateRoleDto;

    return this.datasource.transaction(async (manager) => {
      const data = await manager.findOneOrFail(Role, scope.toOptions());
      const result = await manager.update(Role, scope.where, payload);

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
  }

  archive(scope: ResourceScope) {
    return this.roleRepo.softDelete(scope.where);
  }

  restore(scope: ResourceScope) {
    return this.roleRepo.restore(scope.where);
  }

  delete(scope: ResourceScope) {
    return this.roleRepo.delete(scope.where);
  }
}
