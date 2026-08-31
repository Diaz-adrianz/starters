import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Permission } from '../../../modules/access-control/entities/permission.entity';
import { PermissionsData } from '../data/permissions.data';

export class SeedPermissions1784542135178 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const permissionRepo = dataSource.getRepository(Permission);

    const values = PermissionsData.flatMap((mod) =>
      mod.entries.map((entry) => {
        const [resource, action] = entry.permission.split(':');

        return {
          resource,
          action,
          module: mod.name,
          description: entry.description,
          enabled: true,
        };
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
