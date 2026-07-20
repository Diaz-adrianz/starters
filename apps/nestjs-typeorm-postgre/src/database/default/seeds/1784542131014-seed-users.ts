import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../../modules/users/entities/user.entity';
import rolesData from '../data/roles.json';
import { Role } from '../../../modules/roles/entities/role.entity';
import { UserRole } from '../../../modules/users/entities/user-role.entity';

export class SeedUsers1784544001014 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    if (!process.env.SEED_USERS_PASSWORD) {
      console.log(`❌ Users: SEED_USERS_PASSWORD variable required.`);
      return;
    }
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    const userRoleRepo = dataSource.getRepository(UserRole);

    const password = await hash(process.env.SEED_USERS_PASSWORD, 10);

    const userValues = rolesData.flatMap((role) =>
      (role.users as string[]).map((username: string) => ({
        username: username,
        email: `${username}@example.com`,
        password,
        enabled: true,
        verifiedAt: new Date(),
      })),
    );

    const insertResult = await userRepo
      .createQueryBuilder()
      .insert()
      .values(userValues)
      .orIgnore()
      .execute();

    console.log(
      `🌱 Users: ${(insertResult.raw as any[]).length ?? 0}/${userValues.length} inserted`,
    );

    const allUsers = await userRepo.find();
    const allRoles = await roleRepo.find();

    const userMap = new Map(allUsers.map((u) => [u.username, u]));
    const roleMap = new Map(allRoles.map((r) => [r.name, r]));

    const userRoleValues = rolesData.flatMap((roleEntry) => {
      const role = roleMap.get(roleEntry.name);
      if (!role) return [];

      return (roleEntry.users as string[])
        .map((username) => userMap.get(username))
        .filter((user): user is User => !!user)
        .map((user) => ({ userId: user.id, roleId: role.id }));
    });

    const roleAssignResult = await userRoleRepo
      .createQueryBuilder()
      .insert()
      .values(userRoleValues)
      .orIgnore()
      .execute();

    console.log(
      `🌱 User roles: ${(roleAssignResult.raw as any[]).length ?? 0}/${userRoleValues.length} inserted`,
    );
  }
}
