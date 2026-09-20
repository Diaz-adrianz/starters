import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../../modules/identity/entities/user.entity';
import { Role } from '../../../modules/access-control/entities/role.entity';
import { RoleUser } from '../../../modules/access-control/entities/role-user.entity';
import { UsersData } from '../data/identity/users.data';
import { RolesData } from '../data/access-control/roles.data';

export class AccesscontrolRoleusers1789875196383 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const userRepo = dataSource.getRepository(User),
      roleRepo = dataSource.getRepository(Role),
      roleUserRepo = dataSource.getRepository(RoleUser);

    const users = await userRepo.find({
        where: { username: In(UsersData.map((u) => u.username)) },
      }),
      roles = await roleRepo.find({
        where: { name: In(Object.values(RolesData)) },
      });

    const userMap = new Map(users.map((u) => [u.username, u])),
      roleMap = new Map(roles.map((r) => [r.name, r]));

    const values = UsersData.flatMap((userData) =>
      userData.roles
        .map((roleData) => {
          const user = userMap.get(userData.username);
          const role = roleMap.get(roleData.name);
          if (!user || !role) return null;
          return {
            userId: user.id,
            roleId: role.id,
            username: user.username,
          };
        })
        .filter((value) => !!value),
    );

    const result = await roleUserRepo
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();

    console.log(
      `🌱 [access_control] role_users: ${(result.raw as any[]).length ?? 0}/${values.length} inserted`,
    );
  }
}
