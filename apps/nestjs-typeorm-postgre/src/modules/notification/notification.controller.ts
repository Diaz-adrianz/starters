import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Principal } from '../../shared/classes/principal.class';
import { Permission } from '../../common/decorators/permission.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResourceScopeDto } from '../../shared/dto/resource-scope.dto';
import { RecipientService } from './services/recipient.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly recipientService: RecipientService,
  ) {}

  @Permission('notifications:create')
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

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

  @Permission('notifications:read')
  @Get(':id/recipients')
  async findManyRecipients(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    permission.scope.add({ where: `notificationId:${id}` });
    return this.recipientService.findMany(permission.scope.toPageOptions());
  }
}
