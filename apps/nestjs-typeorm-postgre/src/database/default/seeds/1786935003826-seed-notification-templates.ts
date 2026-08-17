import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Template } from '../../../modules/notification/entities/template.entity';
import { NotificationTemplatesData } from '../data/notification-templates.data';

export class SeedNotificationTemplates1786935003826 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const templateRepo = dataSource.getRepository(Template);

    const values = Object.values(NotificationTemplatesData).map((template) => ({
      ...template,
    }));

    const result = await templateRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 Templates: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
