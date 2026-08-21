import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { ReqUser } from '../../../../common/decorators/req-user.decorator';
import { Principal } from '../../../../shared/classes/principal.class';
import { MessageService } from './message.service';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';

@Controller('notification/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Permission('notification:message:mark-read')
  @Patch(':id/mark-read')
  markRead(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.messageService.markRead(permission.scope);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification:message:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceQueryDto,
  ) {
    permission.scope.addQuery(query, 'and', ['delivery.*']);
    return this.messageService.findMany(permission.scope);
  }

  @Permission('notification:message:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.messageService.delete(permission.scope);
  }
}
