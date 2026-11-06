import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from '../../../modules/access-control/entities/role.entity';
import { RolePermission } from '../../../modules/access-control/entities/role-permission.entity';
import { Permission } from '../../../modules/access-control/entities/permission.entity';
import { PermissionsData } from '../data/access-control/permissions.data';
import { RolesData } from '../data/access-control/roles.data';

export class AccesscontrolRolepermissions1789875572629 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const roleRepo = dataSource.getRepository(Role),
      permissionRepo = dataSource.getRepository(Permission),
      rolePermissionRepo = dataSource.getRepository(RolePermission);

    const roles = await roleRepo.find({
        where: { name: In(Object.values(RolesData)) },
      }),
      permissions = await permissionRepo.find();

    const roleMap = new Map(roles.map((r) => [r.name, r]));
    const permissionMap = new Map(
      permissions.map((p) => [`${p.resource}:${p.action}`, p]),
    );

    const values = PermissionsData.flatMap((group) =>
      group.entries.flatMap((entry) => {
        const permission = permissionMap.get(entry.permission);
        if (!permission) return [];

        return entry.roles.flatMap(({ name, condition }) => {
          const role = roleMap.get(name);
          if (!role) return [];

          return [
            {
              roleId: role.id,
              permissionId: permission.id,
              condition: condition ?? null,
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
      `🌱 [access_control] role_permissions: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
