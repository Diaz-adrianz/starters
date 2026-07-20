import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from '../../../modules/roles/entities/role.entity';
import { RolePermission } from '../../../modules/roles/entities/role-permission.entity';
import { Permission } from '../../../modules/permissions/entities/permission.entity';
import permissionsData from '../data/permissions.json';

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

    const values = permissionsData.flatMap((entry) => {
      const permission = permissionMap.get(`${entry.resource}:${entry.action}`);
      if (!permission) return [];

      return entry.roles
        .map((roleName) => roleMap.get(roleName))
        .filter((role): role is Role => !!role)
        .map((role) => ({ roleId: role.id, permissionId: permission.id }));
    });

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
