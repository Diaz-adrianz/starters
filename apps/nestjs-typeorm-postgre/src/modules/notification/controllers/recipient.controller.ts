import { Controller, Get, Query } from '@nestjs/common';
import { RecipientService } from '../services/recipient.service';
import { Permission } from '../../../common/decorators/permission.decorator';
import { ReqUser } from '../../../common/decorators/req-user.decorator';
import { Principal } from '../../../shared/classes/principal.class';
import { ResourceScopeDto } from '../../../shared/dto/resource-scope.dto';

@Controller('notification/recipients')
export class RecipientController {
  constructor(private recipientService: RecipientService) {}

  @Permission('notification-recipients:find-all')
  @Get()
  findAll(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query, 'AND', ['notification']);
    return this.recipientService.findAll(permission.scope.toPageOptions());
  }
}
