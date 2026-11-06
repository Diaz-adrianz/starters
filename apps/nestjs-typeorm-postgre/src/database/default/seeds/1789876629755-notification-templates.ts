import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Template } from '../../../modules/notification/entities/template.entity';
import { TemplatesData } from '../data/notification/templates.data';

export class NotificationTemplates1789876629755 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const templateRepo = dataSource.getRepository(Template);

    const values = Object.values(TemplatesData).map((template) => ({
      ...template,
    }));

    const result = await templateRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 [notification] templates: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
