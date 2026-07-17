import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../../modules/users/entities/user.entity';
import { genSalt, hash } from 'bcrypt';

export class SeedUsers1784301433775 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const salt = await genSalt(10);

    const repo = dataSource.getRepository(User);
    const result = await repo
      .createQueryBuilder()
      .insert()
      .values([
        {
          username: process.env.SEED_SUPER_USERNAME,
          email: process.env.SEED_SUPER_EMAIL,
          password: await hash(process.env.SEED_SUPER_PASSWORD!, salt),
          enabled: true,
          verifiedAt: new Date(),
        },
      ])
      .orIgnore()
      .execute();

    console.log('🌱 users: %d inserted', (result.raw as any[]).length ?? 0);
  }
}
