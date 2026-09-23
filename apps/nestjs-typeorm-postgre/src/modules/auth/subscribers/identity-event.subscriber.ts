import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IdentityEventName,
  IdentityEventPayload,
} from '../../../infra/event/interfaces/identity-event.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class IdentityEventSubscriber {
  constructor(private authService: AuthService) {}

  @OnEvent(IdentityEventName.USER_UPDATED)
  async userUpdated(payload: IdentityEventPayload['identity.user.updated']) {
    await this.authService.invalidateUsers(payload.target);
  }

  @OnEvent(IdentityEventName.USER_DELETED)
  async userDeleted(payload: IdentityEventPayload['identity.user.deleted']) {
    await this.authService.invalidateUsers(payload.target);
  }
}
