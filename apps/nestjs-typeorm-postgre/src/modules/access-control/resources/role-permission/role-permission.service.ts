import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from '../../entities/role-permission.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { EventService } from '../../../../infra/event/event.service';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: AppRepository<RolePermission>,
    private event: EventService,
  ) {}

  // Base
  // ----------------------------------------------------------------
  async create(dto: CreateRolePermissionDto) {
    const data = await this.rolePermissionRepo.save(
      this.rolePermissionRepo.create(dto),
    );
    this.event.emit('accessControl.rolePermission.created', {
      id: data.id,
      roleId: data.roleId,
      permissionId: data.permissionId,
    });
    return data;
  }

  findMany(rq: ResourceQuery) {
    return this.rolePermissionRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { role: true, permission: true },
      select: {
        id: true,
        createdAt: true,
        permissionId: true,
        roleId: true,
        role: { name: true },
        permission: { description: true, module: true },
      },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.rolePermissionRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { role: true, permission: true },
      select: {
        ...this.rolePermissionRepo.select('*'),
        role: { name: true },
        permission: { description: true, module: true },
      },
    });
  }

  async delete(rq: ResourceQuery) {
    const result = await this.rolePermissionRepo.delete(
      rq.toFindOptions().where,
      { returning: ['id', 'roleId', 'permissionId'] },
    );
    this.event.emit(
      'accessControl.rolePermission.deleted',
      result.raw as Pick<RolePermission, 'id' | 'roleId' | 'permissionId'>[],
    );
    return result;
  }
}
