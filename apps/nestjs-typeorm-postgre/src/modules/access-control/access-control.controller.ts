import { Controller, Get } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { StoreService } from '../../infra/store/store.service';

@Controller('access-control')
export class AccessControlController {
  constructor(
    private accessControlService: AccessControlService,
    private store: StoreService,
  ) {}

  @Get('me')
  me() {
    return this.accessControlService.findUserAccesses(this.store.actor.id);
  }
}
