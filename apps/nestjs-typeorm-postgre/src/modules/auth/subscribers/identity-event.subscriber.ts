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

  @OnEvent(IdentityEventName.USER_PASSWORDUPDATED)
  async userPasswordUpdated(
    payload: IdentityEventPayload['identity.user.passwordUpdated'],
  ) {
    await this.invalidateUsers(payload);

    for (const user of payload) {
      try {
        await this.authService.signOutAll(user.id);
      } catch (error) {
        this.logger.error(
          `Failed to sign out all sessions for user ${user.id}`,
          error,
          this.name,
        );
      }
    }
    this.logger.debug(
      `User ${payload.map((p) => p.id).join(', ')} invalidated and signed out on user.passwordUpdated`,
      this.name,
    );
  }

  @OnEvent(IdentityEventName.USER_UPDATED)
  async userUpdated(payload: IdentityEventPayload['identity.user.updated']) {
    await this.invalidateUsers(payload.target);
    this.logger.debug(
      `User ${payload.target.map((t) => t.id).join(', ')} invalidated on user.updated`,
      this.name,
    );
  }

  @OnEvent(IdentityEventName.USER_DELETED)
  async userDeleted(payload: IdentityEventPayload['identity.user.deleted']) {
    await this.invalidateUsers(payload.target);
    this.logger.debug(
      `User ${payload.target.map((t) => t.id).join(', ')} invalidated on user.updated`,
      this.name,
    );
  }

  private async invalidateUsers(users: { id: string }[]) {
    try {
      await this.authService.invalidateUsers(users);
    } catch (error) {
      this.logger.error(
        `Failed to invalidate users ${users.map((u) => u.id).join(', ')}`,
        error,
        this.name,
      );
    }
  }
}
