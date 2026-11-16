import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleUser } from '../../entities/role-user.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { CreateRoleUserDto } from './dto/create-role-user.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';
import { ResourceService } from '../../../../common/services/resource.service';
import { Repository } from 'typeorm';
import { AccessControlService } from '../../access-control.service';

@Injectable()
export class RoleUserService extends ResourceService<RoleUser> {
  constructor(
    @InjectRepository(RoleUser, DatabaseKeys.DEFAULT)
    private roleUserRepo: Repository<RoleUser>,
    private accessControlService: AccessControlService,
  ) {
    super(roleUserRepo);
  }

  updateByUserId(id: string, dto: UpdateRoleUserDto) {
    const rq = new ResourceQuery([['userId', 'eq', id]]);
    return this.update(rq, dto);
  }

  deleteByUserId(id: string) {
    const rq = new ResourceQuery([['userId', 'eq', id]]);
    return this.delete(rq);
  }

  async create(dto: CreateRoleUserDto) {
    const data = this.roleUserRepo.create(dto),
      res = await this.roleUserRepo.save(data);
    await this.accessControlService.invalidateUsers(res.userId);
    return res;
  }

  async findMany(rq: ResourceQuery) {
    return this.roleUserRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { role: true },
      select: { ...this.select('*'), role: { name: true } },
    });
  }

  async update(rq: ResourceQuery, dto: UpdateRoleUserDto) {
    const data = await this.load(rq.toFindOptions());
    this.roleUserRepo.merge(data, dto);

    const res = await this.roleUserRepo.save(data);
    await this.accessControlService.invalidateUsers(res.userId);
    return res;
  }

  async delete(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions()),
      res = await this.roleUserRepo.remove(data);
    await this.accessControlService.invalidateUsers(res.userId);
    return res;
  }
}
