import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Page } from '../../../modules/access-control/entities/page.entity';
import { PagesData } from '../data/access-control/pages.data';

export class AccesscontrolPages1789876374718 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const pageRepo = dataSource.getRepository(Page);

    const values = PagesData.map(({ name, description }) => ({
      name,
      description,
      enabled: true,
    }));

    const pageResult = await pageRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 [access_control] pages: ${(pageResult.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
