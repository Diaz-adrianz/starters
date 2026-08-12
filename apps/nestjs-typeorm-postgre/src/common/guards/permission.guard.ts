import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  PERMISSION_METADATA,
  PermissionMetadata,
} from '../decorators/permission.decorator';
import { DefaultCacheService } from '../../lib/cache/default/default-cache.service';
import { DefaultLoggerService } from '../../lib/logger/default/default-logger.service';
import { Principal } from '../../shared/classes/principal.class';
import { ResourceScopeIntf } from '../../shared/interfaces/resource-scope.interface';
import { RolePermission } from '../../modules/access-control/entities/role-permission.entity';
import { ResourceScope } from '../../shared/classes/resource-scope.class';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppDataSource } from '../../database/typeorm/app-data-source';
import { DatabaseKeys } from '../../database/database-keys.contant';

type RolePermissionsCache = [string, ResourceScopeIntf | null];

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    private reflector: Reflector,
    private cacheService: DefaultCacheService,
    private loggerService: DefaultLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const metadata = this.reflector.getAllAndOverride<PermissionMetadata>(
        PERMISSION_METADATA,
        [context.getHandler(), context.getClass()],
      ),
      message = metadata.forbiddenMessage || 'Access denied';

    if (!metadata?.permission || !req.user)
      throw new ForbiddenException(message);

    const rolePermissionRepo = this.dataSource.getRepository(RolePermission);

    const principal = req.user as Principal;
    const permissions = new Map<
      RolePermissionsCache[0],
      RolePermissionsCache[1][]
    >();

    for (const role of principal.roles) {
      try {
        let cached = await this.cacheService.get<RolePermissionsCache[]>((k) =>
          k.rolePermissions(role.id),
        );

        if (!cached || !cached.length) {
          const rolePermissions = await rolePermissionRepo.find({
            where: { role: { id: role.id } },
            relations: { permission: true },
            select: {
              roleId: true,
              scope: true,
              permission: { resource: true, action: true },
            },
          });

          cached = rolePermissions.map((rp) => [
            `${rp.permission.resource}:${rp.permission.action}`,
            rp.scope,
          ]);
          await this.cacheService.set(
            (k) => k.rolePermissions(role.id),
            cached,
          );
        }

        cached.forEach((p) => {
          const existing = permissions.get(p[0]) ?? [];
          permissions.set(p[0], [...existing, p[1]]);
        });
      } catch (error) {
        this.loggerService.error(error, 'PermissionGuard');
      }
    }

    const scopes = permissions.get(metadata.permission);
    if (!scopes?.length) throw new ForbiddenException(message);

    const resourceScope = new ResourceScope();
    scopes.forEach((scope) => {
      if (scope)
        resourceScope.add(scope, 'OR', 'auto', {
          subject: principal.toSubject(),
        });
    });

    principal.permission = { name: metadata.permission, scope: resourceScope };

    return true;
  }
}
