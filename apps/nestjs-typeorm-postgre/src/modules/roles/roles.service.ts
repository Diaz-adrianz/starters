import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import {
  UpdateRolePermissionsAction,
  UpdateRolePermissionsDto,
} from './dto/update-role-permission.dto';
import { RolePermission } from './entities/role-permission.entity';
import { DefaultCacheService } from '../../lib/cache/default/default-cache.service';
import { ResourceScopePageOptions } from '../../shared/classes/resource-scope.class';
import { BaseService } from '../../common/classes/base/service.base';

@Injectable()
export class RolesService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(RolePermission)
    private rolePermissionRepo: Repository<RolePermission>,
    private cacheService: DefaultCacheService,
  ) {
    super(roleRepo);
  }

  async clearPermissionsCache(roleIds: string[]) {
    if (!roleIds.length) return;

    const keys = roleIds.map((roleId) =>
      this.cacheService.resolveKey((k) => k.rolePermissions(roleId)),
    );
    await this.cacheService.delMany(keys);
  }

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepo.insert(createRoleDto);
  }

  findAll(options: ResourceScopePageOptions) {
    return this.roleRepo.findAndCount(options);
  }

  findOne(id: string) {
    return this.roleRepo.findOneOrFail({
      where: { id },
      relations: { permissions: { permission: true } },
    });
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.roleRepo.update({ id }, updateRoleDto);
  }

  async updatePermissions(
    id: string,
    { action, permissions }: UpdateRolePermissionsDto,
  ) {
    const rolePermissions = this.rolePermissionRepo.create(
      permissions.map((rp) => ({
        roleId: id,
        permissionId: rp.permissionId,
        scope: rp.scope,
      })),
    );

    await this.clearPermissionsCache([id]);

    if (action == UpdateRolePermissionsAction.ADD) {
      return this.rolePermissionRepo.insert(rolePermissions);
    } else if (action == UpdateRolePermissionsAction.REMOVE) {
      return this.rolePermissionRepo.delete({
        roleId: id,
        permissionId: In(permissions.map((p) => p.permissionId)),
      });
    } else if (action == UpdateRolePermissionsAction.SET) {
      await this.rolePermissionRepo.delete({ roleId: id });
      return this.rolePermissionRepo.insert(rolePermissions);
    }
  }

  softDelete(id: string) {
    return this.roleRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.roleRepo.restore({ id });
  }

  delete(id: string) {
    return this.roleRepo.delete({ id });
  }
}
