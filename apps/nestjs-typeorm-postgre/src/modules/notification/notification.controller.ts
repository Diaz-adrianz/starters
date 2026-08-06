import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Principal } from '../../shared/classes/principal.class';
import { Permission } from '../../common/decorators/permission.decorator';
import { ResourceScopeDto } from '../../shared/dto/resource-scope.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Permission('notifications:mark-read')
  @Patch(':id/mark-read')
  markRead(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.notificationService.markRead(permission.scope);
  }

  // ================================================================
  // Basic CRUD
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

  @Permission('notifications:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.notificationService.delete(permission.scope);
  }
}
