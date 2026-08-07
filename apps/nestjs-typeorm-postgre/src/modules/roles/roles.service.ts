import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../access-control/entities/role.entity';
import { In, Repository } from 'typeorm';
import {
  UpdateRolePermissionsAction,
  UpdateRolePermissionsDto,
} from './dto/update-role-permission.dto';
import { RolePermission } from '../access-control/entities/role-permission.entity';
import {
  ResourceScopeOptions,
  ResourceScopePageOptions,
} from '../../shared/classes/resource-scope.class';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(RolePermission)
    private rolePermissionRepo: Repository<RolePermission>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepo.insert(createRoleDto);
  }

  findAll(options: ResourceScopePageOptions) {
    return this.roleRepo.findAndCount(options);
  }

  findOne(options: ResourceScopeOptions) {
    return this.roleRepo.findOneOrFail({
      ...options,
      relations: { permissions: { permission: true } },
    });
  }

  update(options: ResourceScopeOptions, updateRoleDto: UpdateRoleDto) {
    return this.roleRepo.update(options.where, updateRoleDto);
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

  softDelete(options: ResourceScopeOptions) {
    return this.roleRepo.softDelete(options.where);
  }

  restore(options: ResourceScopeOptions) {
    return this.roleRepo.restore(options.where);
  }

  delete(options: ResourceScopeOptions) {
    return this.roleRepo.delete(options.where);
  }
}
