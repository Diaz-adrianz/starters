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
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { IdentityEventSubscriber } from './subscribers/identity-event.subscriber';
import { RoleUserService } from './resources/role-user/role-user.service';
import { RolePermissionService } from './resources/role-permission/role-permission.service';
import { RolePermissionController } from './resources/role-permission/role-permission.controller';
import { RoleUserController } from './resources/role-user/role-user.controller';
import { RoleSubscriber } from './entities/subscribers/role.subscriber';
import { PermissionSubscriber } from './entities/subscribers/permission.subscriber';
import { RoleUserSubscriber } from './entities/subscribers/role-user.subscriber';
import { RolePermissionSubscriber } from './entities/subscribers/role-permission.subscriber';

@Module({
  imports: [
    DefaultDatabaseModule.forFeature([
      Permission,
      Role,
      RolePermission,
      RoleUser,
    ]),
  ],
  controllers: [
    AccessControlController,
    PermissionController,
    RoleController,
    RoleUserController,
    RolePermissionController,
  ],
  providers: [
    AccessControlService,
    PermissionService,
    RoleService,
    RoleUserService,
    RolePermissionService,

    // subscribers
    IdentityEventSubscriber,

    // entity subscribers
    RoleSubscriber,
    PermissionSubscriber,
    RoleUserSubscriber,
    RolePermissionSubscriber,
  ],
  exports: [AccessControlService],
})
export class AccessControlModule {}
