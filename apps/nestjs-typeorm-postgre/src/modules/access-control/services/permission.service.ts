import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { ResourceScope } from '../../../shared/classes/resource-scope.class';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
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
      select: { id: true, group: true, description: true },
    });
  }

  findOne(scope: ResourceScope) {
    return this.permissionRepo.findOneOrFail({ ...scope.toOptions() });
  }

  update(scope: ResourceScope, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepo.update(scope.where, updatePermissionDto);
  }

  archive(scope: ResourceScope) {
    return this.permissionRepo.softDelete(scope.where);
  }

  restore(scope: ResourceScope) {
    return this.permissionRepo.restore(scope.where);
  }
}
