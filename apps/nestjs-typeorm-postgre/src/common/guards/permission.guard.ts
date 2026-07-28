import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import {
  PERMISSION_METADATA,
  PermissionMetadata,
} from '../decorators/permission.decorator';
import { DefaultCacheService } from '../../lib/cache/default/default-cache.service';
import { DefaultLoggerService } from '../../lib/logger/default/default-logger.service';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { Principal } from '../../shared/classes/principal.class';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cacheService: DefaultCacheService,
    private loggerService: DefaultLoggerService,
    private dataSource: DataSource,
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

    const principal = req.user as Principal;
    const rolePermissions = new Set<string>();

    for (const role of principal.roles) {
      try {
        let cached = await this.cacheService.get<string[]>((k) =>
          k.rolePermissions(role.id),
        );

        if (!cached || !cached.length) {
          const permissionRepo = this.dataSource.getRepository(Permission);
          const permissions = await permissionRepo.find({
            where: { roles: { role: { id: role.id } } },
          });

          cached = permissions.map((p) => `${p.resource}:${p.action}`);
          await this.cacheService.set(
            (k) => k.rolePermissions(role.id),
            cached,
          );
        }

        cached.forEach((p) => rolePermissions.add(p));
      } catch (error) {
        this.loggerService.error(error, 'PermissionGuard');
      }
    }

    const hasPermission = rolePermissions.has(metadata.permission);
    if (!hasPermission) throw new ForbiddenException(message);

    return true;
  }
}
