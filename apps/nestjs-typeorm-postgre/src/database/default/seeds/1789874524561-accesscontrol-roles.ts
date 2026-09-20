import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from '../../../modules/access-control/entities/role.entity';
import { RolesData } from '../data/access-control/roles.data';

export class AccesscontrolRoles1789874524561 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const roleRepo = dataSource.getRepository(Role);

    const values = Object.values(RolesData).map((name) => ({
      name,
      default: true,
      enabled: true,
    }));

    const result = await roleRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 [access_control] roles: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
