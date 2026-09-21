import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppDataSource } from '../../../../database/typeorm/app-data-source';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { Role } from '../../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { EventService } from '../../../../infra/event/event.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    @InjectRepository(Role, DatabaseKeys.DEFAULT)
    private roleRepo: AppRepository<Role>,
    private event: EventService,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  create(createRoleDto: CreateRoleDto) {
    return this.roleRepo.insert(createRoleDto);
  }

  findMany(rq: ResourceQuery) {
    return this.roleRepo.findAndCount({
      ...rq.toFindOptions(),
      select: { id: true, name: true, default: true, enabled: true },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.roleRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { permissions: { permission: true } },
      select: {
        ...this.roleRepo.select('*'),
        permissions: {
          id: true,
          createdAt: true,
          condition: true,
          permission: { id: true, module: true, description: true },
        },
      },
    });
  }

  async update(rq: ResourceQuery, updateRoleDto: UpdateRoleDto) {
    const result = await this.roleRepo.update(
      rq.toFindOptions().where,
      updateRoleDto,
      { returning: ['id'] },
    );
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async archive(rq: ResourceQuery) {
    const result = await this.roleRepo.softDelete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async restore(rq: ResourceQuery) {
    const result = await this.roleRepo.restore(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async delete(rq: ResourceQuery) {
    const result = await this.roleRepo.delete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.deleted', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }
}
