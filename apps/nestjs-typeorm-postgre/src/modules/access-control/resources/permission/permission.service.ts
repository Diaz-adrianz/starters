import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RolePermission } from '../../entities/role-permission.entity';
import { RoleService } from '../role/role.service';
import { Permission } from '../../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission, DatabaseKeys.DEFAULT)
    private permissionRepo: AppRepository<Permission>,
    @InjectRepository(RolePermission, DatabaseKeys.DEFAULT)
    private rolePermissionRepo: AppRepository<RolePermission>,
    private roleService: RoleService,
  ) {}

  async findGroups() {
    const result: { group: string; count: string }[] = await this.permissionRepo
      .createQueryBuilder('p')
      .select('p.group', 'group')
      .addSelect('COUNT(p.id)', 'count')
      .groupBy('p.group')
      .getRawMany();

    return result.map((row) => ({
      group: row.group,
      count: Number(row.count),
    }));
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  findMany(scope: ResourceScope) {
    return this.permissionRepo.findAndCount({
      ...scope.toFindOptions(),
      select: this.permissionRepo.select([
        'id',
        'group',
        'description',
        'enabled',
      ]),
    });
  }

  findOne(scope: ResourceScope) {
    return this.permissionRepo.findOneOrFail({ ...scope.toFindOptions() });
  }

  async update(scope: ResourceScope, updatePermissionDto: UpdatePermissionDto) {
    const result = await this.permissionRepo.update(
      scope.toFindOptions().where,
      updatePermissionDto,
      { returning: ['id'] },
    );

    const affectedRoles = await this.rolePermissionRepo.find({
      where: {
        permission: In(
          (result.raw as Pick<Permission, 'id'>[]).map((p) => p.id),
        ),
      },
      select: { roleId: true },
    });
    await this.roleService.invalidateMany(
      affectedRoles.map((role) => ({ id: role.roleId })),
    );
    return;
  }
}
