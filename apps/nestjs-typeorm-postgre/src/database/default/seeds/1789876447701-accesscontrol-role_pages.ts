import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Page } from '../../../modules/access-control/entities/page.entity';
import { RolePage } from '../../../modules/access-control/entities/role-page.entity';
import { Role } from '../../../modules/access-control/entities/role.entity';
import { PagesData } from '../data/access-control/pages.data';
import { RolesData } from '../data/access-control/roles.data';

export class AccesscontrolRolePages1789876447701 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const pageRepo = dataSource.getRepository(Page),
      rolePageRepo = dataSource.getRepository(RolePage),
      roleRepo = dataSource.getRepository(Role);

    const pages = await pageRepo.find({
        where: { name: In(PagesData.map((p) => p.name)) },
      }),
      roles = await roleRepo.find({
        where: { name: In(Object.values(RolesData)) },
      });

    const values = PagesData.flatMap((pageData) => {
      const page = pages.find((p) => p.name === pageData.name);
      if (!page) return [];

      return pageData.roles
        .map((r) => roles.find((role) => role.name === r.name))
        .filter((role): role is Role => !!role)
        .map((role) => ({ roleId: role.id, pageId: page.id }));
    });

    const result = await rolePageRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 [access_control] role_pages: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
