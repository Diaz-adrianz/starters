import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Page } from '../../../modules/access-control/entities/page.entity';
import { RolePage } from '../../../modules/access-control/entities/role-page.entity';
import { Role } from '../../../modules/access-control/entities/role.entity';
import { PagesData } from '../data/accesscontrol-pages.data';

export class SeedAccesscontrolPages1789024776663 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const pageRepo = dataSource.getRepository(Page);
    const rolePageRepo = dataSource.getRepository(RolePage);
    const roleRepo = dataSource.getRepository(Role);

    const pageValues = PagesData.map(({ name, description }) => ({
      name,
      description,
    }));

    const pageResult = await pageRepo
      .createQueryBuilder()
      .insert()
      .values(pageValues)
      .orIgnore()
      .execute();

    console.log(
      `🌱 Pages: ${(pageResult.raw as any[]).length ?? 0}/${pageValues.length} inserted`,
    );

    const pages = await pageRepo.find();
    const roles = await roleRepo.find();

    const rolePageValues = PagesData.flatMap((pageData) => {
      const page = pages.find((p) => p.name === pageData.name);
      if (!page) return [];

      return pageData.roles
        .map((r) => roles.find((role) => role.name === r.name))
        .filter((role): role is Role => !!role)
        .map((role) => ({ roleId: role.id, pageId: page.id }));
    });

    const rolePageResult = await rolePageRepo
      .createQueryBuilder()
      .insert()
      .values(rolePageValues)
      .orIgnore()
      .execute();

    console.log(
      `🌱 RolePages: ${(rolePageResult.raw as any[]).length ?? 0}/${rolePageValues.length} inserted`,
    );
  }
}
