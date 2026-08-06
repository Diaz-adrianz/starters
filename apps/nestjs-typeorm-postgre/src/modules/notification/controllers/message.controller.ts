import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { Permission } from '../../../common/decorators/permission.decorator';
import { CreateMessageDto } from '../dto/create-message.dto';
import { ReqUser } from '../../../common/decorators/req-user.decorator';
import { Principal } from '../../../shared/classes/principal.class';
import { ResourceScopeDto } from '../../../shared/dto/resource-scope.dto';

@Controller('notification-messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification-messages:create')
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Permission('notification-messages:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.messageService.findMany(permission.scope);
  }

  @Permission('notification-messages:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.messageService.findOne(permission.scope);
  }

  @Permission('notification-messages:archive')
  @Patch(':id/archive')
  softDelete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.messageService.archive(permission.scope);
  }

  @Permission('notification-messages:restore')
  @Patch(':id/restore')
  restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.messageService.restore(permission.scope);
  }

  @Permission('notification-messages:delete')
  @Delete(':id')
  delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.messageService.delete(permission.scope);
  }
}
