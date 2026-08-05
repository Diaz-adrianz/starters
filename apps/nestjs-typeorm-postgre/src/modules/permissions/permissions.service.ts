import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import {
  ResourceScopeOptions,
  ResourceScopePageOptions,
} from '../../shared/classes/resource-scope.class';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepo.insert(createPermissionDto);
  }

  findAll(options: ResourceScopePageOptions) {
    return this.permissionRepo.findAndCount(options);
  }

  findOne(options: ResourceScopeOptions) {
    return this.permissionRepo.findOneOrFail(options);
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
