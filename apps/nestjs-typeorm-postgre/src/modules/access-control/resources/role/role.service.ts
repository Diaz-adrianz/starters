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

  // ================================================================
  // RolePage
  // ----------------------------------------------------------------
  async setPage(id: string, dto: SetRolePageDto) {
    const res = await (dto.assign
      ? this.rolePageRepo.insert({ roleId: id, pageId: dto.pageId })
      : this.rolePageRepo.delete({ roleId: id, pageId: dto.pageId }));
    this.event.emit('accessControl.role.page_set', {
      target: [{ id }],
      payload: { pageId: dto.pageId },
    });
    return res;
  }

  findManyPage(id: string, rq: ResourceQuery) {
    rq.add([['roleId', 'eq', id]]);
    return this.rolePageRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { page: true },
      select: {
        ...this.rolePageRepo.select('*'),
        page: { description: true },
      },
    });
  }

  // ================================================================
  // RolePermission
  // ----------------------------------------------------------------
  async setPermission(id: string, dto: SetRolePermissionDto) {
    const res = await (dto.grant
      ? this.rolePermissionRepo.upsert(
          {
            roleId: id,
            permissionId: dto.permissionId,
            condition: dto.condition,
          },
          { conflictPaths: ['roleId', 'permissionId'] },
        )
      : this.rolePermissionRepo.delete({
          roleId: id,
          permissionId: dto.permissionId,
        }));
    this.event.emit('accessControl.role.permission_set', {
      target: [{ id }],
      payload: { permissionId: dto.permissionId },
    });
    return res;
  }

  findManyPermission(id: string, rq: ResourceQuery) {
    rq.add([['roleId', 'eq', id]]);
    return this.rolePermissionRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { permission: true },
      select: {
        ...this.rolePermissionRepo.select('*'),
        permission: { description: true },
      },
    });
  }

  // ================================================================
  // RoleUser
  // ----------------------------------------------------------------
  async setUser(id: string, dto: SetRoleUserDto) {
    const res = await (dto.assign
      ? this.roleUserRepo.insert({
          roleId: id,
          userId: dto.userId,
          username: dto.username,
        })
      : this.roleUserRepo.delete({ roleId: id, userId: dto.userId }));
    this.event.emit('accessControl.role.user_set', {
      target: [{ id }],
      payload: { userId: dto.userId },
    });
    return res;
  }

  findManyUser(id: string, rq: ResourceQuery) {
    rq.add([['roleId', 'eq', id]]);
    return this.roleUserRepo.findAndCount(rq.toFindOptions());
  }

  updateUserByUserId(
    userId: string,
    payload: Partial<Pick<RoleUser, 'username'>>,
  ) {
    return this.roleUserRepo.update({ userId }, payload);
  }

  deleteUserByUserId(userId: string) {
    return this.roleUserRepo.delete({ userId });
  }

  // ================================================================
  // Misc / shared
  // ----------------------------------------------------------------
  findOneByName(name: string) {
    return this.roleRepo.findOneOrFail({ where: { name } });
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
      target: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async archive(rq: ResourceQuery) {
    const result = await this.roleRepo.softDelete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.updated', {
      target: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async restore(rq: ResourceQuery) {
    const result = await this.roleRepo.restore(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.updated', {
      target: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async delete(rq: ResourceQuery) {
    rq.add([
      ['default', 'eq', false],
      ['deletedAt', 'neq', null],
    ]);
    const result = await this.roleRepo.delete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.deleted', {
      target: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }
}
