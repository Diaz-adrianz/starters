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
    private service: AccessControlService,
  ) {}

  @OnEvent(IdentityEventName.USER_CREATED)
  async userCreated(user: IdentityEventPayload['identity.user.created']) {
    if (user.roles?.length) {
      for (const r of user.roles) {
        const role = await this.roleService
          .findOneByName(r.name)
          .catch(() => null);

        if (!role) {
          this.logger.warn(
            `Role "${r.name}" not found for new user "${user.id}", skipping role assignment`,
            this.name,
          );
          return;
        }

        try {
          await this.roleUserService.create({
            roleId: role.id,
            userId: user.id,
            username: user.username,
          });
          this.logger.debug(
            `Role "${r.name}" assigned for user "${user.id}" on user.created`,
            this.name,
          );
        } catch (error) {
          this.logger.error(
            `Failed to assign role "${r.name}" for user "${user.id}"`,
            error,
            this.name,
          );
        }
      }
    }
  }

  @OnEvent(IdentityEventName.USER_UPDATED)
  async userUpdated(user: IdentityEventPayload['identity.user.updated']) {
    await this.service.invalidateUsers(user.id);

    try {
      await this.roleUserService.updateByUserId(user.id, {
        username: user.username,
      });
      this.logger.debug(
        `role-users updated for user ${user.id} on user.updated`,
        this.name,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update role-user for user "${user.id}"`,
        error,
        this.name,
      );
    }
  }

  @OnEvent(IdentityEventName.USER_DELETED)
  async userDeleted(user: IdentityEventPayload['identity.user.deleted']) {
    await this.service.invalidateUsers(user.id);

    try {
      await this.roleUserService.deleteByUserId(user.id);
      this.logger.debug(
        `role-users deleted for user ${user.id} on user.deleted`,
        this.name,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete role-user for user "${user.id}"`,
        error,
        this.name,
      );
    }
  }
}
