import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_METADATA, RolesMetadata } from '../decorators/roles.decorator';
import { Request } from 'express';
import { Principal } from '../../shared/classes/principal.class';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const metadata = this.reflector.getAllAndOverride<RolesMetadata>(
        ROLES_METADATA,
        [context.getHandler(), context.getClass()],
      ),
      message = metadata.forbiddenMessage || 'Access denied';

    const req = context.switchToHttp().getRequest<Request>();
    const principal = req.user as Principal | undefined;

    if (
      !metadata?.roles.length ||
      !principal ||
      !principal.roles.some((role) => metadata.roles.includes(role.name))
    )
      throw new ForbiddenException(message);

    return true;
  }
}
