import { Module } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleService } from './resources/role/role.service';
import { PermissionController } from './resources/permission/permission.controller';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { RoleController } from './resources/role/role.controller';
import { PermissionService } from './resources/permission/permission.service';
import { AccessControlEventSubscriber } from './subscribers/access-control-event.subscriber';
import { Page } from './entities/page.entity';
import { RolePage } from './entities/role-page.entity';
import { PageService } from './resources/page/page.service';
import { PageController } from './resources/page/page.controller';

@Module({
  imports: [
    DefaultDatabaseModule.forFeature([
      Permission,
      RolePermission,
      Role,
      UserRole,
      Page,
      RolePage,
    ]),
  ],
  controllers: [PermissionController, RoleController, PageController],
  providers: [
    PermissionService,
    RoleService,
    PageService,

    // subscribers
    AccessControlEventSubscriber,
  ],
})
export class AccessControlModule {}
