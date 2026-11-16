import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { Role } from '../../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { ResourceService } from '../../../../common/services/resource.service';
import { Repository } from 'typeorm';
import { AccessControlService } from '../../access-control.service';

@Injectable()
export class RoleService extends ResourceService<Role> {
  constructor(
    @InjectRepository(Role, DatabaseKeys.DEFAULT)
    private roleRepo: Repository<Role>,
    private accessControlService: AccessControlService,
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
    const data = await this.load(rq.toFindOptions());
    this.roleRepo.merge(data, dto);

    const res = this.roleRepo.save(data);
    await this.accessControlService.invalidateRoles(data.id);
    return res;
  }

  async archive(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions()),
      res = this.roleRepo.softRemove(data);
    await this.accessControlService.invalidateRoles(data.id);
    return res;
  }

  async restore(rq: ResourceQuery) {
    rq.setTrash(true);
    const data = await this.load(rq.toFindOptions()),
      res = this.roleRepo.recover(data);
    await this.accessControlService.invalidateRoles(data.id);
    return res;
  }

  async delete(rq: ResourceQuery) {
    rq.add([['default', 'eq', false]]);
    rq.setTrash(true);
    const data = await this.load(rq.toFindOptions()),
      res = this.roleRepo.remove(data);
    await this.accessControlService.invalidateRoles(data.id);
    return res;
  }
}
