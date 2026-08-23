import { Controller, Get, Param, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { ReqUser } from '../../../../common/decorators/req-user.decorator';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { Principal } from '../../../../shared/classes/principal.class';

@Controller('tracker/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('tracker:activity:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceQueryDto,
  ) {
    permission.scope.addQuery(query);
    return this.activityService.findMany(permission.scope);
  }

  @Permission('tracker:activity:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.activityService.findOne(permission.scope);
  }
}
