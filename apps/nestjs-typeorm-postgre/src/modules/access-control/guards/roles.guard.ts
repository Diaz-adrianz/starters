import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StoreService } from '../../../infra/store/store.service';
import {
  ROLES_METADATA_KEY,
  RolesMetadata,
} from '../../../common/decorators/roles.decorator';
import { AccessControlService } from '../access-control.service';
import { CacheService } from '../../../infra/cache/cache.service';
import { LoggerService } from '../../../infra/logger/logger.service';
import { HOUR } from '../../../shared/utils/number.util';

type UserRolesCache = { id: string; name: string }[];

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private store: StoreService,
    private cache: CacheService,
    private logger: LoggerService,
    private accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const actor = this.store.get('actor'),
      metadata = this.reflector.getAllAndOverride<RolesMetadata | undefined>(
        ROLES_METADATA_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!actor || !metadata) return true;

    const forbiddenMessage = metadata.forbiddenMessage ?? 'Access denied';

    let rolesCache = await this.cache.get<UserRolesCache>((k) =>
      k.userRoles(actor.id),
    );
    if (!rolesCache) {
      this.logger.debug('User roles cache missed', this.constructor.name);
      const roles = await this.accessControlService.findRolesByUser(actor.id);

      rolesCache = roles.map((role) => ({
        id: role.id,
        name: role.name,
      }));

      await this.cache.set((k) => k.userRoles(actor.id), rolesCache, 1 * HOUR);
    }

    if (
      metadata &&
      !rolesCache.some((role) => metadata.roles.includes(role.name))
    )
      throw new ForbiddenException(forbiddenMessage);

    this.store.set('actor', { ...actor, roles: rolesCache });

    return true;
  }
}
