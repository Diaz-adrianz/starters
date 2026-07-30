import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { ResourceScopePageOptions } from '../../shared/classes/resource-scope.class';
import { BaseService } from '../../common/classes/base/service.base';

@Injectable()
export class PermissionsService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {
    super(permissionRepo);
  }

  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepo.insert(createPermissionDto);
  }

  findAll(options: ResourceScopePageOptions) {
    return this.permissionRepo.findAndCount(options);
  }

  findOne(id: string) {
    return this.permissionRepo.findOneOrFail({ where: { id } });
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepo.update({ id }, updatePermissionDto);
  }

  softDelete(id: string) {
    return this.permissionRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.permissionRepo.restore({ id });
  }

  delete(id: string) {
    return this.permissionRepo.delete({ id });
  }
}
