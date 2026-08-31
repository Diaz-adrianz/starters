import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CacheService } from '../../../infra/cache/cache.service';
import {
  IdentityEventName,
  IdentityEventPayload,
} from '../../../infra/event/interfaces/identity-event.interface';

@Injectable()
export class IdentityEventSubscriber {
  constructor(private cache: CacheService) {}

  @OnEvent(IdentityEventName.IDENTITY_USER_UPDATED)
  async userUpdated(payload: IdentityEventPayload['identity.user.updated']) {
    await this.invalidateUsers(payload.users);
  }

  @OnEvent(IdentityEventName.IDENTITY_USER_DELETED)
  async userDeleted(payload: IdentityEventPayload['identity.user.deleted']) {
    await this.invalidateUsers(payload.users);
  }

  // Utils
  // ----------------------------------------------------------------
  invalidateUsers(users: { id: string }[]) {
    return this.cache.delMany((k) => users.map((user) => k.user(user.id)));
  }
}
