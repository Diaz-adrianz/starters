import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { ReqUser } from '../../../../common/decorators/req-user.decorator';
import { Principal } from '../../../../shared/classes/principal.class';
import { ResourceScopeDto } from '../../../../shared/dto/resource-scope.dto';
import { MessageService } from './message.service';

@Controller('notification/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Permission('notification-messages:mark-read')
  @Patch(':id/mark-read')
  markRead(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.messageService.markRead(permission.scope);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification-messages:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query, 'AND', ['delivery']);
    return this.messageService.findMany(permission.scope);
  }

  @Permission('notification-messages:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.messageService.delete(permission.scope);
  }
}
