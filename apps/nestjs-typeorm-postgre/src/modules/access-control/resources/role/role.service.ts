import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppDataSource } from '../../../../database/typeorm/app-data-source';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { Role } from '../../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { EventService } from '../../../../infra/event/event.service';

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

  findMany(scope: ResourceScope) {
    return this.roleRepo.findAndCount({
      ...scope.toFindOptions(),
      select: { id: true, name: true, default: true, enabled: true },
    });
  }

  findOne(scope: ResourceScope) {
    return this.roleRepo.findOneOrFail({
      ...scope.toFindOptions(),
      relations: { permissions: { permission: true } },
      select: {
        ...this.roleRepo.select('*'),
        permissions: {
          id: true,
          createdAt: true,
          scope: true,
          permission: { id: true, module: true, description: true },
        },
      },
    });
  }

  async update(scope: ResourceScope, updateRoleDto: UpdateRoleDto) {
    const result = await this.roleRepo.update(
      scope.toFindOptions().where,
      updateRoleDto,
      { returning: ['id'] },
    );
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async archive(scope: ResourceScope) {
    const result = await this.roleRepo.softDelete(scope.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async restore(scope: ResourceScope) {
    const result = await this.roleRepo.restore(scope.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.updated', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }

  async delete(scope: ResourceScope) {
    const result = await this.roleRepo.delete(scope.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.role.deleted', {
      roles: result.raw as Pick<Role, 'id'>[],
    });
    return result;
  }
}
