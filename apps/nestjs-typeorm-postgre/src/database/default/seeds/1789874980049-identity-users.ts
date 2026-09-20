import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../../modules/identity/entities/user.entity';
import { UsersData } from '../data/identity/users.data';

export class IdentityUsers1789874980049 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    if (!process.env.SEED_USERS_PASSWORD) {
      console.log(
        `❌ [identity] users: SEED_USERS_PASSWORD variable required.`,
      );
      return;
    }
    const userRepo = dataSource.getRepository(User);

    const password = await hash(process.env.SEED_USERS_PASSWORD, 10);

    const values = UsersData.map((user) => ({
      username: user.username,
      email: user.email,
      password,
      enabled: true,
      verifiedAt: new Date(),
    }));

    const insertResult = await userRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 [identity] users: ${(insertResult.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
