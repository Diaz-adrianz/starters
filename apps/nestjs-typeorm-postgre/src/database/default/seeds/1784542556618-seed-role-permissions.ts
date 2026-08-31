import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from '../../../modules/access-control/entities/role.entity';
import { RolePermission } from '../../../modules/access-control/entities/role-permission.entity';
import { Permission } from '../../../modules/access-control/entities/permission.entity';
import { PermissionsData } from '../data/permissions.data';

export class SeedRolePermissions1784542556618 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const roleRepo = dataSource.getRepository(Role);
    const permissionRepo = dataSource.getRepository(Permission);
    const rolePermissionRepo = dataSource.getRepository(RolePermission);

    const roles = await roleRepo.find();
    const permissions = await permissionRepo.find();

    const roleMap = new Map(roles.map((r) => [r.name, r]));
    const permissionMap = new Map(
      permissions.map((p) => [`${p.resource}:${p.action}`, p]),
    );

    const values = PermissionsData.flatMap((group) =>
      group.entries.flatMap((entry) => {
        const permission = permissionMap.get(entry.permission);
        if (!permission) return [];

        return entry.roles.flatMap(({ name, scope }) => {
          const role = roleMap.get(name);
          if (!role) return [];

          return [
            {
              roleId: role.id,
              permissionId: permission.id,
              scope: scope ?? null,
            },
          ];
        });
      }),
    );

    const result = await rolePermissionRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 Role permissions: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
