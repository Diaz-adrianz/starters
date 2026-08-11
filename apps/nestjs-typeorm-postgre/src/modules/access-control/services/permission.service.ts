import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { ResourceScope } from '../../../shared/classes/resource-scope.class';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { AppRepository } from '../../../database/typeorm/app-repository';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission, 'default')
    private permissionRepo: AppRepository<Permission>,
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
      ...scope.toPageOptions(),
      select: this.permissionRepo.select([
        'id',
        'group',
        'description',
        'enabled',
      ]),
    });
  }

  findOne(scope: ResourceScope) {
    return this.permissionRepo.findOneOrFail({ ...scope.toOptions() });
  }

  update(scope: ResourceScope, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepo.update(scope.where, updatePermissionDto);
  }
}
