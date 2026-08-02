import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Permission } from '../../../modules/permissions/entities/permission.entity';
import permissionsData from '../data/permissions.json';

type PermissionEntry = [string, string];

export class SeedPermissions1784542135178 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const permissionRepo = dataSource.getRepository(Permission);

    const values = (permissionsData as PermissionEntry[]).map(
      ([resource, action]) => ({
        resource,
        action,
        description: `${action} ${resource}`,
      }),
    );

    const result = await permissionRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 Permissions: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
