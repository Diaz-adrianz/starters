import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSION_METADATA,
  PermissionMetadata,
} from '../decorators/permission.decorator';
import { Scope } from '../../shared/interfaces/resource-scope.interface';
import { RolePermission } from '../../modules/access-control/entities/role-permission.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppDataSource } from '../../database/typeorm/app-data-source';
import { DatabaseKeys } from '../../database/database-keys.constant';
import { LoggerService } from '../../infra/logger/logger.service';
import { CacheService } from '../../infra/cache/cache.service';
import { StoreService } from '../../infra/store/store.service';

type RolePermissionsCache = [string, Scope | null];

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    private reflector: Reflector,
    private cache: CacheService,
    private logger: LoggerService,
    private store: StoreService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const actor = this.store.get('actor');

    const metadata = this.reflector.getAllAndOverride<PermissionMetadata>(
        PERMISSION_METADATA,
        [context.getHandler(), context.getClass()],
      ),
      message = metadata.forbiddenMessage || 'Access denied';

    if (!metadata?.permission || !actor) throw new ForbiddenException(message);

    const rolePermissionRepo = this.dataSource.getRepository(RolePermission);

    const permissions = new Map<
      RolePermissionsCache[0],
      RolePermissionsCache[1][]
    >();

    for (const role of actor.roles) {
      try {
        let cached = await this.cache.get<RolePermissionsCache[]>((k) =>
          k.rolePermissions(role.id),
        );

        if (!cached || !cached.length) {
          this.logger.debug('Permissions cache missed', this.constructor.name);

          const rolePermissions = await rolePermissionRepo.find({
            where: { role: { id: role.id }, permission: { enabled: true } },
            relations: { permission: true },
            select: {
              roleId: true,
              scope: true,
              permission: { module: true, resource: true, action: true },
            },
          });

          cached = rolePermissions.map((rp) => [
            `${rp.permission.module}:${rp.permission.resource}:${rp.permission.action}`,
            rp.scope,
          ]);
          await this.cache.set((k) => k.rolePermissions(role.id), cached, 0);
        }

        cached.forEach((p) => {
          const existing = permissions.get(p[0]) ?? [];
          permissions.set(p[0], [...existing, p[1]]);
        });
      } catch (error) {
        this.logger.warn(
          `Failed to load permissions for role "${role.name}"`,
          error,
          this.constructor.name,
        );
      }
    }

    const scopes = permissions.get(metadata.permission);
    if (!scopes?.length) throw new ForbiddenException(message);

    this.store.set('permission', {
      module: metadata.module,
      resource: metadata.resource,
      action: metadata.action,
      scopes: scopes.some((s) => s === null)
        ? []
        : scopes.filter((s): s is Scope => s !== null),
    });

    return true;
  }
}
