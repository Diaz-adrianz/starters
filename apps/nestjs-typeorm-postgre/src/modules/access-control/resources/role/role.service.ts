import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppDataSource } from '../../../../database/typeorm/app-data-source';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { Role } from '../../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { EventService } from '../../../../infra/event/event.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { SetRoleUserDto } from './dto/set-role-user.dto';
import { RoleUser } from '../../entities/role-user.entity';
import { RolePermission } from '../../entities/role-permission.entity';
import { SetRolePermissionDto } from './dto/set-role-permission.dto';
import { RolePage } from '../../entities/role-page.entity';
import { SetRolePageDto } from './dto/set-role-page.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    @InjectRepository(Role, DatabaseKeys.DEFAULT)
    private roleRepo: AppRepository<Role>,
    @InjectRepository(RoleUser, DatabaseKeys.DEFAULT)
    private roleUserRepo: AppRepository<RoleUser>,
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: AppRepository<RolePermission>,
    @InjectRepository(RolePage, DatabaseKeys.DEFAULT)
    private rolePageRepo: AppRepository<RolePage>,
    private event: EventService,
  ) {}

  setPage(id: string, dto: SetRolePageDto) {
    // TODO: emit event role.pageAssigned and role.pageUnassigned
    if (dto.assign)
      return this.rolePageRepo.insert({ roleId: id, pageId: dto.pageId });
    else return this.rolePageRepo.delete({ roleId: id, pageId: dto.pageId });
  }

  findManyPage(id: string, rq: ResourceQuery) {
    rq.add([{ field: 'roleId', op: 'eq', value: id }]);
    return this.rolePageRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { page: true },
      select: {
        ...this.rolePageRepo.select('*'),
        page: { description: true },
      },
    });
  }

  setPermission(id: string, dto: SetRolePermissionDto) {
    // TODO: emit event role.permissionGranted and role.permissionRevoked
    if (dto.grant)
      return this.rolePermissionRepo.upsert(
        {
          roleId: id,
          permissionId: dto.permissionId,
          condition: dto.condition,
        },
        { conflictPaths: ['roleId', 'permissionId'] },
      );
    else
      return this.rolePermissionRepo.delete({
        roleId: id,
        permissionId: dto.permissionId,
      });
  }

  findManyPermission(id: string, rq: ResourceQuery) {
    rq.add([{ field: 'roleId', op: 'eq', value: id }]);
    return this.rolePermissionRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { permission: true },
      select: {
        ...this.rolePermissionRepo.select('*'),
        permission: { description: true },
      },
    });
  }

  setUser(id: string, dto: SetRoleUserDto) {
    // TODO: emit event role.userAssigned and role.userUnassigned
    if (dto.assign)
      return this.roleUserRepo.insert({
        roleId: id,
        userId: dto.userId,
        username: dto.username,
      });
    else return this.roleUserRepo.delete({ roleId: id, userId: dto.userId });
  }

  findManyUser(id: string, rq: ResourceQuery) {
    rq.add([{ field: 'roleId', op: 'eq', value: id }]);
    return this.roleUserRepo.findAndCount(rq.toFindOptions());
  }

  // ================================================================
  // Base
  // ----------------------------------------------------------------
  create(createRoleDto: CreateRoleDto) {
    return this.roleRepo.insert(createRoleDto);
  }

  findMany(rq: ResourceQuery) {
    return this.roleRepo.findAndCount({
      ...rq.toFindOptions(),
      select: { id: true, name: true, default: true, enabled: true },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.roleRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { permissions: { permission: true } },
      select: {
        ...this.roleRepo.select('*'),
        permissions: {
          id: true,
          createdAt: true,
          condition: true,
          permission: { id: true, module: true, description: true },
        },
      },
    });
  }

  async update(rq: ResourceQuery, updateRoleDto: UpdateRoleDto) {
    const result = await this.roleRepo.update(
      rq.toFindOptions().where,
      updateRoleDto,
      { returning: ['id'] },
    );
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async archive(rq: ResourceQuery) {
    const result = await this.roleRepo.softDelete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async restore(rq: ResourceQuery) {
    const result = await this.roleRepo.restore(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async delete(rq: ResourceQuery) {
    const result = await this.roleRepo.delete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.deleted', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }
}
