import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from '../../entities/permission.entity';
import { EventService } from '../../../../infra/event/event.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

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
  findMany(rq: ResourceQuery) {
    return this.permissionRepo.findAndCount({
      ...rq.toFindOptions(),
      select: this.permissionRepo.select([
        'id',
        'module',
        'description',
        'enabled',
      ]),
    });
  }

  findOne(rq: ResourceQuery) {
    return this.permissionRepo.findOneOrFail({ ...rq.toFindOptions() });
  }

  async update(rq: ResourceQuery, updatePermissionDto: UpdatePermissionDto) {
    const result = await this.permissionRepo.update(
      rq.toFindOptions().where,
      updatePermissionDto,
      { returning: ['id'] },
    );

    this.event.emit('accessControl.permission.updated', {
      target: result.raw as Pick<Permission, 'id'>[],
    });
    return;
  }
}
