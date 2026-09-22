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

  @OnEvent(IdentityEventName.USER_UPDATED)
  async userUpdated(payload: IdentityEventPayload['identity.user.updated']) {
    await this.invalidateUsers(payload.target);
  }

  @OnEvent(IdentityEventName.USER_DELETED)
  async userDeleted(payload: IdentityEventPayload['identity.user.deleted']) {
    await this.invalidateUsers(payload.target);
  }

  // Utils
  // ----------------------------------------------------------------
  invalidateUsers(users: { id: string }[]) {
    return this.cache.delMany((k) => users.map((user) => k.user(user.id)));
  }
}
