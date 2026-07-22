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
  PERMISSIONS_METADATA,
  PermissionsMetadata,
} from '../decorators/permissions.decorator';
import { AuthContext } from '../classes/auth-context.class';
import { DefaultCacheService } from '../../cache/default/default-cache.service';
import { DefaultLoggerService } from '../../lib/logger/default/default-logger.service';
import { Permission } from '../../modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cacheService: DefaultCacheService,
    private logger: DefaultLoggerService,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const metadata = this.reflector.getAllAndOverride<PermissionsMetadata>(
        PERMISSIONS_METADATA,
        [context.getHandler(), context.getClass()],
      ),
      message = metadata.message || 'Access denied';

    if (!metadata?.permissions?.length) throw new ForbiddenException(message);

    const authContext = req.user as AuthContext;
    const rolePermissions = new Set<string>();

    for (const roleId of authContext.roles) {
      try {
        let cached = await this.cacheService.get<string[]>((k) =>
          k.rolePermissions(roleId),
        );

        if (!cached || !cached.length) {
          const permissionRepo = this.dataSource.getRepository(Permission);
          const permissions = await permissionRepo.find({
            where: { roles: { role: { id: roleId } } },
          });

          cached = permissions.map((p) => `${p.resource}:${p.action}`);
          await this.cacheService.set((k) => k.rolePermissions(roleId), cached);
        }

        cached.forEach((p) => rolePermissions.add(p));
      } catch (error) {
        this.logger.error(error, 'PermissionGuard');
      }
    }

    authContext.hasPermission = metadata.permissions.some((p) =>
      rolePermissions.has(p),
    );

    if (metadata.strict && !authContext.hasPermission)
      throw new ForbiddenException(message);

    return true;
  }
}
