import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { PermissionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';

@Module({
  imports: [
    DefaultDatabaseModule.forFeature([
      Permission,
      RolePermission,
      Role,
      UserRole,
    ]),
  ],
  controllers: [AccessControlController, PermissionController, RoleController],
  providers: [AccessControlService, PermissionService, RoleService],
})
export class AccessControlModule {}
