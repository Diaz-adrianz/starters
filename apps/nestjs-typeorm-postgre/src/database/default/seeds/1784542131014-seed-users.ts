import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../../modules/identity/entities/user.entity';
import { Role } from '../../../modules/access-control/entities/role.entity';
import { UserRole } from '../../../modules/access-control/entities/user-role.entity';
import { UsersData } from '../data/users.data';

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

    const userValues = UsersData.map((user) => ({
      username: user.username,
      email: user.email,
      password,
      enabled: true,
      verifiedAt: new Date(),
    }));

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

    const userRoleValues = UsersData.flatMap((userData) =>
      userData.roles
        .map((roleData) => {
          const user = userMap.get(userData.username);
          const role = roleMap.get(roleData.name);
          if (!user || !role) return null;
          return {
            userId: user.id,
            roleId: role.id,
          };
        })
        .filter((value) => !!value),
    );

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
