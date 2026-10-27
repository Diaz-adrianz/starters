import { Module } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { RoleUser } from './entities/role-user.entity';
import { RoleService } from './resources/role/role.service';
import { PermissionController } from './resources/permission/permission.controller';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { RoleController } from './resources/role/role.controller';
import { PermissionService } from './resources/permission/permission.service';
import { AccessControlEventSubscriber } from './subscribers/access-control-event.subscriber';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { IdentityEventSubscriber } from './subscribers/identity-event.subscriber';

@Module({
  imports: [
    DefaultDatabaseModule.forFeature([
      Permission,
      Role,
      RolePermission,
      RoleUser,
    ]),
  ],
  controllers: [AccessControlController, PermissionController, RoleController],
  providers: [
    AccessControlService,
    PermissionService,
    RoleService,

    // subscribers
    AccessControlEventSubscriber,
    IdentityEventSubscriber,
  ],
  exports: [AccessControlService],
})
export class AccessControlModule {}
