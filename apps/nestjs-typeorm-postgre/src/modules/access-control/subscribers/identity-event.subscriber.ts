import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IdentityEventName,
  IdentityEventPayload,
} from '../../../infra/event/interfaces/identity-event.interface';
import { RoleService } from '../resources/role/role.service';
import { LoggerService } from '../../../infra/logger/logger.service';
import { AccessControlService } from '../access-control.service';
import { RoleUserService } from '../resources/role-user/role-user.service';

@Injectable()
export class IdentityEventSubscriber {
  private name = 'access-control/' + this.constructor.name;

  constructor(
    private roleService: RoleService,
    private roleUserService: RoleUserService,
    private logger: LoggerService,
    private accessControlService: AccessControlService,
  ) {}

  @OnEvent(IdentityEventName.USER_CREATED)
  async userCreated({
    target,
    payload,
  }: IdentityEventPayload['identity.user.created']) {
    if (payload.roles?.length) {
      for (const r of payload.roles) {
        const role = await this.roleService
          .findOneByName(r.name)
          .catch(() => null);

        if (!role) {
          this.logger.warn(
            `Role "${r.name}" not found for new user "${target.id}", skipping role assignment`,
            this.name,
          );
          return;
        }

        try {
          await this.roleUserService.create({
            roleId: role.id,
            userId: target.id,
            username: payload.username,
          });
          this.logger.debug(
            `Role "${r.name}" assigned for user "${target.id}" on user.created`,
            this.name,
          );
        } catch (error) {
          this.logger.error(
            `Failed to assign role "${r.name}" for user "${target.id}"`,
            error,
            this.name,
          );
        }
      }
    }
  }

  @OnEvent(IdentityEventName.USER_UPDATED)
  async userUpdated({
    target,
    payload,
  }: IdentityEventPayload['identity.user.updated']) {
    for (const t of target) {
      await this.invalidateUsers([{ id: t.id }]);

      if (payload?.username)
        try {
          await this.roleUserService.updateByUserId(t.id, {
            username: payload.username,
          });
        } catch (error) {
          this.logger.error(
            `Failed to update role-user for user "${t.id}"`,
            error,
            this.name,
          );
        }

      this.logger.debug(
        `user "${t.id}" invalidated and synced on user.updated`,
        this.name,
      );
    }
  }

  @OnEvent(IdentityEventName.USER_DELETED)
  async userDeleted(payload: IdentityEventPayload['identity.user.deleted']) {
    for (const t of payload.target) {
      await this.invalidateUsers([{ id: t.id }]);
      try {
        await this.roleUserService.deleteByUserId(t.id);
      } catch (error) {
        this.logger.error(
          `Failed to delete role-user for user "${t.id}"`,
          error,
          this.name,
        );
      }

      this.logger.debug(
        `user "${t.id}" invalidated and synced on user.deleted`,
        this.name,
      );
    }
  }

  private async invalidateUsers(users: { id: string }[]) {
    try {
      await this.accessControlService.invalidateUsers(users);
    } catch (error) {
      this.logger.error(
        `Failed to invalidate users ${users.map((u) => u.id).join(', ')}`,
        error,
        this.name,
      );
    }
  }
}
