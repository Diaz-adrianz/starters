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
            this.constructor.name,
          );
          return;
        }

        await this.roleUserService.create({
          roleId: role.id,
          userId: target.id,
          username: payload.username,
        });
      }
    }
  }

  @OnEvent(IdentityEventName.USER_UPDATED)
  async userUpdated({
    target,
    payload,
  }: IdentityEventPayload['identity.user.updated']) {
    for (const t of target) {
      await this.accessControlService.invalidateUsers([{ id: t.id }]);
      if (payload?.username)
        await this.roleUserService.updateByUserId(t.id, {
          username: payload.username,
        });
    }
  }

  @OnEvent(IdentityEventName.USER_DELETED)
  async userDeleted(payload: IdentityEventPayload['identity.user.deleted']) {
    for (const t of payload.target) {
      await this.accessControlService.invalidateUsers([{ id: t.id }]);
      await this.roleUserService.deleteByUserId(t.id);
    }
  }
}
