import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { Role } from '../../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { ResourceService } from '../../../../common/services/resource.service';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService extends ResourceService<Role> {
  constructor(
    @InjectRepository(Role, DatabaseKeys.DEFAULT)
    private roleRepo: Repository<Role>,
  ) {
    super(roleRepo);
  }

  async findOneByName(name: string) {
    return this.roleRepo.findOneOrFail({ where: { name } });
  }

  async create(dto: CreateRoleDto) {
    const data = this.roleRepo.create(dto);
    return this.roleRepo.save(data);
  }

  async findMany(rq: ResourceQuery) {
    return this.roleRepo.findAndCount({
      ...rq.toFindOptions(),
      select: { id: true, name: true, default: true, enabled: true },
    });
  }

  async findOne(rq: ResourceQuery) {
    return this.roleRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { permissions: { permission: true } },
      select: {
        ...this.select('*'),
        permissions: {
          id: true,
          createdAt: true,
          condition: true,
          permission: { id: true, module: true, description: true },
        },
      },
    });
  }

  async update(rq: ResourceQuery, dto: UpdateRoleDto) {
    const data = await this.load({ ...rq.toFindOptions() });
    this.roleRepo.merge(data, dto);
    return this.roleRepo.save(data);
  }

  async archive(rq: ResourceQuery) {
    const data = await this.load({ ...rq.toFindOptions() });
    return this.roleRepo.softRemove(data);
  }

  async restore(rq: ResourceQuery) {
    rq.add([['deletedAt', 'neq', null]]);
    const data = await this.load({ ...rq.toFindOptions() }, true);
    return this.roleRepo.recover(data);
  }

  async delete(rq: ResourceQuery) {
    rq.add([
      ['default', 'eq', false],
      ['deletedAt', 'neq', null],
    ]);
    const data = await this.load({ ...rq.toFindOptions() }, true);
    return this.roleRepo.remove(data);
  }
}
