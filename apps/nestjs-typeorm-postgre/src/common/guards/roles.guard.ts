import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_METADATA, RolesMetadata } from '../decorators/roles.decorator';
import { StoreService } from '../../infra/store/store.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private store: StoreService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const metadata = this.reflector.getAllAndOverride<RolesMetadata>(
        ROLES_METADATA,
        [context.getHandler(), context.getClass()],
      ),
      message = metadata.forbiddenMessage || 'Access denied';

    const actor = this.store.get('actor');

    if (
      !metadata?.roles.length ||
      !actor ||
      !actor.roles.some((role) => metadata.roles.includes(role.name))
    )
      throw new ForbiddenException(message);

    return true;
  }
}
