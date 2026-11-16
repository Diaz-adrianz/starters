import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IdentityEventName,
  IdentityEventPayload,
} from '../../../infra/event/interfaces/identity-event.interface';
import { AuthService } from '../auth.service';
import { LoggerService } from '../../../infra/logger/logger.service';

@Injectable()
export class IdentityEventSubscriber {
  private name = 'auth/' + this.constructor.name;

  constructor(
    private authService: AuthService,
    private logger: LoggerService,
  ) {}

  @OnEvent(IdentityEventName.USER_UPDATED)
  async userUpdated(user: IdentityEventPayload['identity.user.updated']) {
    await this.authService.invalidateUsers(user.id);

    if (user.password)
      try {
        await this.authService.signOutAll(user.id);
        this.logger.debug(
          `User ${user.id} signed out on user.updated with password`,
          this.name,
        );
      } catch (error) {
        this.logger.error(
          `Failed to sign out all sessions for user ${user.id}`,
          error,
          this.name,
        );
      }
  }

  @OnEvent(IdentityEventName.USER_ARCHIVED)
  async userArchived(user: IdentityEventPayload['identity.user.archived']) {
    await this.authService.invalidateUsers(user.id);
  }

  @OnEvent(IdentityEventName.USER_RESTORED)
  async userRestored(user: IdentityEventPayload['identity.user.restored']) {
    await this.authService.invalidateUsers(user.id);
  }

  @OnEvent(IdentityEventName.USER_DELETED)
  async userDeleted(user: IdentityEventPayload['identity.user.deleted']) {
    await this.authService.invalidateUsers(user.id);
  }
}
