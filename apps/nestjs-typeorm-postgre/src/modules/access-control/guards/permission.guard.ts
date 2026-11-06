import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StoreService } from '../../../infra/store/store.service';
import { AccessControlService } from '../access-control.service';
import {
  PERMISSION_METADATA_KEY,
  PermissionMetadata,
} from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private store: StoreService,
    private accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const actor = this.store.get('actor'),
      metadata = this.reflector.getAllAndOverride<
        PermissionMetadata | undefined
      >(PERMISSION_METADATA_KEY, [context.getHandler(), context.getClass()]);

    if (actor && metadata) {
      const valid = await this.accessControlService.validateUserPermission(
        actor.id,
        metadata.key,
      );

      if (valid === null)
        throw new ForbiddenException(
          metadata.forbiddenMessage ?? 'Permission access denied',
        );

      this.store.set('permission', {
        key: metadata.key,
        conditions: valid.some((s) => s === null)
          ? []
          : valid.filter((s) => s !== null),
      });
    }

    return true;
  }
}
