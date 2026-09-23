import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IdentityEventName,
  IdentityEventPayload,
} from '../../../infra/event/interfaces/identity-event.interface';
import { RoleService } from '../resources/role/role.service';
import { CacheService } from '../../../infra/cache/cache.service';
import { LoggerService } from '../../../infra/logger/logger.service';

@Injectable()
export class IdentityEventSubscriber {
  constructor(
    private roleService: RoleService,
    private cache: CacheService,
    private logger: LoggerService,
  ) {}

  @OnEvent(IdentityEventName.USER_CREATED)
  async userCreated({
    target,
    payload,
  }: IdentityEventPayload['identity.user.created']) {
    if (payload.roleName) {
      const role = await this.roleService
        .findOneByName(payload.roleName)
        .catch(() => null);

      if (!role) {
        this.logger.warn(
          `Role "${payload.roleName}" not found for new user "${target.id}", skipping role assignment`,
          this.constructor.name,
        );
        return;
      }

      await this.roleService.setUser(role.id, {
        assign: true,
        userId: target.id,
        username: payload.username,
      });
    }
  }

  @OnEvent(IdentityEventName.USER_UPDATED)
  async userUpdated({
    target,
    payload,
  }: IdentityEventPayload['identity.user.updated']) {
    for (const t of target) {
      await this.invalidateUsers([{ id: t.id }]);
      await this.roleService.updateUserByUserId(t.id, {
        username: payload?.username,
      });
    }
  }

  @OnEvent(IdentityEventName.USER_DELETED)
  async userDeleted(payload: IdentityEventPayload['identity.user.deleted']) {
    for (const t of payload.target) {
      await this.invalidateUsers([{ id: t.id }]);
      await this.roleService.deleteUserByUserId(t.id);
    }
  }

  // Utils
  // ----------------------------------------------------------------
  private invalidateUsers(users: { id: string }[]) {
    return this.cache.delMany((k) => users.map((user) => k.user(user.id)));
  }
}
