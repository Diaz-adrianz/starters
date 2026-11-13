import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from '../../entities/role-permission.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { ResourceService } from '../../../../common/services/resource.service';
import { Repository } from 'typeorm';

@Injectable()
export class RolePermissionService extends ResourceService<RolePermission> {
  constructor(
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: Repository<RolePermission>,
  ) {
    super(rolePermissionRepo);
  }

  // Base
  // ----------------------------------------------------------------
  async create(dto: CreateRolePermissionDto) {
    const data = this.rolePermissionRepo.create(dto);
    return this.rolePermissionRepo.save(data);
  }

  async findMany(rq: ResourceQuery) {
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

  async findOne(rq: ResourceQuery) {
    return this.rolePermissionRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { role: true, permission: true },
      select: {
        ...this.select('*'),
        role: { name: true },
        permission: { description: true, module: true },
      },
    });
  }

  async delete(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions());
    return this.rolePermissionRepo.remove(data);
  }
}
