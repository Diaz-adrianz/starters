import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { ResourceScope } from '../../../shared/classes/resource-scope.class';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { repoSelect } from '../../../shared/utils/typeorm/repo-select.util';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  create(createRoleDto: CreateRoleDto) {
    return this.roleRepo.insert(createRoleDto);
  }

  findMany(scope: ResourceScope) {
    return this.roleRepo.findAndCount({
      ...scope.toPageOptions(),
      select: { id: true, name: true, isDefault: true },
    });
  }

  findOne(scope: ResourceScope) {
    return this.roleRepo.findOneOrFail({
      ...scope.toOptions(),
      relations: { permissions: { permission: true } },
      select: {
        ...repoSelect(this.roleRepo, '*'),
        permissions: {
          id: true,
          createdAt: true,
          scope: true,
          permission: { id: true, group: true, description: true },
        },
      },
    });
  }

  update(scope: ResourceScope, updateRoleDto: UpdateRoleDto) {
    return this.roleRepo.update(scope.where, updateRoleDto);
  }

  archive(scope: ResourceScope) {
    return this.roleRepo.softDelete(scope.where);
  }

  restore(scope: ResourceScope) {
    return this.roleRepo.restore(scope.where);
  }

  delete(scope: ResourceScope) {
    return this.roleRepo.delete(scope.where);
  }
}
