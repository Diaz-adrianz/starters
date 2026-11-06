import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../../access-control/decorators/permission.decorator';

@Controller('notification/messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private store: StoreService,
  ) {}

  @Permission('notification:message:read')
  @Get('/count')
  count(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.messageService.count(rq);
  }

  @Permission('notification:message:mark-read')
  @Patch(':id/mark-read')
  markRead(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.messageService.markRead(rq);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification:message:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store
      .buildResourceQuery()
      .addFromDto(query, 'and', ['delivery.*']);
    return this.messageService.findMany(rq);
  }

  @Permission('notification:message:delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.messageService.delete(rq);
  }
}
