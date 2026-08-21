import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from '../../entities/permission.entity';
import { EventService } from '../../../../infra/event/event.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission, DatabaseKeys.DEFAULT)
    private permissionRepo: AppRepository<Permission>,
    private event: EventService,
  ) {}

  async findModules() {
    const result: { module: string; count: string }[] =
      await this.permissionRepo
        .createQueryBuilder('p')
        .select('p.module', 'module')
        .addSelect('COUNT(p.id)', 'count')
        .groupBy('p.module')
        .getRawMany();

    return result.map((row) => ({
      module: row.module,
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
        'module',
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

    this.event.emit('accessControl.permission.updated', {
      permissions: result.raw as Pick<Permission, 'id'>[],
    });
    return;
  }
}
