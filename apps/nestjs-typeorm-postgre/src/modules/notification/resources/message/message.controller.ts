import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { MessageService } from './message.service';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';

@Controller('notification/messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private store: StoreService,
  ) {}

  @Permission('notification:message:mark-read')
  @Patch(':id/mark-read')
  markRead(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.messageService.markRead(scope);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification:message:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const scope = this.store.buildResourceScope();
    scope.addQuery(query, 'and', ['delivery.*']);
    return this.messageService.findMany(scope);
  }

  @Permission('notification:message:delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.messageService.delete(scope);
  }
}
