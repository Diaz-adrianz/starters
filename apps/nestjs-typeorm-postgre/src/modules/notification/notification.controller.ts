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
import { NotificationService } from './notification.service';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Principal } from '../../shared/classes/principal.class';
import { Permission } from '../../common/decorators/permission.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResourceScopeDto } from '../../shared/dto/resource-scope.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import { ResSuccess } from '../../common/decorators/res-success.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ================================================================
  // Create
  // ----------------------------------------------------------------
  @Permission('notifications:create')
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  // ================================================================
  // Read
  // ----------------------------------------------------------------
  @Permission('notifications:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query, 'AND', ['recipients']);
    return this.notificationService.findMany(permission.scope.toPageOptions());
  }

  @Permission('notifications:read')
  @Get(':id')
  async findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.notificationService.findOne(permission.scope.toOptions());
  }

  // ================================================================
  // Update
  // ----------------------------------------------------------------
  @ResSuccess({ allowNoAffected: true })
  @Permission('notifications:mark-as-read')
  @Patch('mark-as-read')
  async markAsRead(
    @ReqUser() { permission }: Principal,
    @Body() markAsReadDto: MarkAsReadDto,
  ) {
    return this.notificationService.markAsRead(permission.scope, markAsReadDto);
  }

  // ================================================================
  // Delete
  // ----------------------------------------------------------------
  @Permission('notifications:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.notificationService.delete(permission.scope);
  }
}
