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
} from '../decorators/roles.decorator';
import { AccessControlService } from '../access-control.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private store: StoreService,
    private accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const actor = this.store.get('actor'),
      metadata = this.reflector.getAllAndOverride<RolesMetadata | undefined>(
        ROLES_METADATA_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (actor && metadata) {
      const valid = await this.accessControlService.validateUserRoles(
        actor.id,
        metadata.roleNames,
      );

      if (valid === null)
        throw new ForbiddenException(
          metadata.forbiddenMessage ?? 'Role access denied',
        );
    }

    return true;
  }
}
