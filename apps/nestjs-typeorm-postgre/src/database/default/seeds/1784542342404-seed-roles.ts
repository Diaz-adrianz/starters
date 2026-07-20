import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import rbacData from '../data/rbac.json';
import { Role } from '../../../modules/roles/entities/role.entity';

export class SeedRoles1784542342404 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const roleRepo = dataSource.getRepository(Role);

    const values = [...new Set(rbacData.flatMap((entry) => entry.roles))].map(
      (roleName) => ({
        name: roleName,
      }),
    );

    const result = await roleRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 Roles: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
