import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleUser } from '../../entities/role-user.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CreateRoleUserDto } from './dto/create-role-user.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { EventService } from '../../../../infra/event/event.service';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';

@Injectable()
export class RoleUserService {
  constructor(
    @InjectRepository(RoleUser, DatabaseKeys.DEFAULT)
    private roleUserRepo: AppRepository<RoleUser>,
    private event: EventService,
  ) {}

  updateByUserId(id: string, dto: UpdateRoleUserDto) {
    const rq = new ResourceQuery([['userId', 'eq', id]]);
    return this.update(rq, dto);
  }

  deleteByUserId(id: string) {
    const rq = new ResourceQuery([['userId', 'eq', id]]);
    return this.delete(rq);
  }

  // Base
  // ----------------------------------------------------------------
  async create(dto: CreateRoleUserDto) {
    const data = await this.roleUserRepo.save(this.roleUserRepo.create(dto));
    this.event.emit('accessControl.roleUser.created', {
      id: data.id,
      roleId: data.roleId,
      userId: data.userId,
    });
    return data;
  }

  findMany(rq: ResourceQuery) {
    return this.roleUserRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { role: true },
      select: { ...this.roleUserRepo.select('*'), role: { name: true } },
    });
  }

  async update(rq: ResourceQuery, dto: UpdateRoleUserDto) {
    const result = await this.roleUserRepo.update(
      rq.toFindOptions().where,
      dto,
      { returning: ['id', 'roleId', 'userId'] },
    );
    return result;
  }

  async delete(rq: ResourceQuery) {
    const result = await this.roleUserRepo.delete(rq.toFindOptions().where, {
      returning: ['id', 'roleId', 'userId'],
    });
    this.event.emit(
      'accessControl.roleUser.deleted',
      result.raw as Pick<RoleUser, 'id' | 'roleId' | 'userId'>[],
    );
    return result;
  }
}
