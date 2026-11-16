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
    const metadata = this.reflector.getAllAndOverride<
      RolesMetadata | undefined
    >(ROLES_METADATA_KEY, [context.getHandler(), context.getClass()]);

    if (!metadata) return true;

    const user = this.store.user;
    const valid = await this.accessControlService.validateUserRoles(
      user.id,
      metadata.roleNames,
    );

    if (valid === null)
      throw new ForbiddenException(
        metadata.forbiddenMessage ?? 'Role access denied',
      );

    return true;
  }
}
