import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from '../../entities/permission.entity';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { ResourceService } from '../../../../common/services/resource.service';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService extends ResourceService<Permission> {
  constructor(
    @InjectRepository(Permission, DatabaseKeys.DEFAULT)
    private permissionRepo: Repository<Permission>,
  ) {
    super(permissionRepo);
  }

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

  async findMany(rq: ResourceQuery) {
    return this.permissionRepo.findAndCount({
      ...rq.toFindOptions(),
      select: this.select(['id', 'module', 'description', 'enabled']),
    });
  }

  async findOne(rq: ResourceQuery) {
    return this.permissionRepo.findOneOrFail({ ...rq.toFindOptions() });
  }

  async update(rq: ResourceQuery, dto: UpdatePermissionDto) {
    const data = await this.load({ ...rq.toFindOptions() });
    this.permissionRepo.merge(data, dto);
    return this.permissionRepo.save(data);
  }
}
