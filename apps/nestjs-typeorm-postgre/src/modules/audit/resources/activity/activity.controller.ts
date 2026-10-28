import { Controller, Get, Param, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Permission } from '../../../access-control/decorators/permission.decorator';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';

@Controller('audit/activities')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private store: StoreService,
  ) {}

  @Permission('audit:activity:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.activityService.findMany(rq);
  }

  @Permission('audit:activity:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.activityService.findOne(rq);
  }
}
