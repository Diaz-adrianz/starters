import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../database/typeorm/app-repository';
import { Role } from './entities/role.entity';
import { DatabaseKeys } from '../../database/database-keys.constant';
import { Permission } from './entities/permission.entity';

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(Role, DatabaseKeys.DEFAULT)
    private roleRepo: AppRepository<Role>,
    @InjectRepository(Permission, DatabaseKeys.DEFAULT)
    private permissionRepo: AppRepository<Permission>,
  ) {}

  findRolesByUser(userId: string) {
    return this.roleRepo.find({ where: { users: { userId }, enabled: true } });
  }

  findPermissionsByRole(roleId: string) {
    return this.permissionRepo.find({
      where: { roles: { roleId, role: { enabled: true } }, enabled: true },
      relations: { roles: true },
    });
  }
}
