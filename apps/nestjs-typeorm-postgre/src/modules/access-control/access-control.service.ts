import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../database/database-keys.constant';
import { RoleUser } from './entities/role-user.entity';
import { CacheService } from '../../infra/cache/cache.service';
import { LoggerService } from '../../infra/logger/logger.service';
import { HOUR } from '../../shared/utils/number.util';

type UserRolesCache = { id: string; name: string }[];

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(RoleUser, DatabaseKeys.DEFAULT)
    private roleUserRepo: AppRepository<RoleUser>,
    private cache: CacheService,
    private logger: LoggerService,
  ) {}

  async validateUserRoles(userId: string, roleNames: string[]) {
    const roles = await this.findUserActiveRoles(userId);
    return roles.some((role) => roleNames.includes(role.name)) ? roles : null;
  }

  // Utils
  // ----------------------------------------------------------------
  private async findUserActiveRoles(userId: string) {
    let roles = await this.cache.get<UserRolesCache>((k) =>
      k.userRoles(userId),
    );

    if (!roles) {
      this.logger.debug('User roles cache missed', this.constructor.name);
      const userRoles = await this.roleUserRepo.find({
        where: { userId, role: { enabled: true } },
        relations: { role: true },
      });

      roles = userRoles.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
      }));
      await this.cache.set((k) => k.userRoles(userId), roles, 1 * HOUR);
    }

    return roles;
  }
}
