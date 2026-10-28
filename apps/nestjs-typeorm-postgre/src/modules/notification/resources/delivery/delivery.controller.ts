import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../../access-control/decorators/permission.decorator';
import { AuditActivity } from '../../../audit/decorators/audit-activity.decorator';

@Controller('notification/deliveries')
export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    private store: StoreService,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @AuditActivity({ targetId: ({ res }) => res.id })
  @Permission('notification:delivery:create')
  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.create(dto);
  }

  @Permission('notification:delivery:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.deliveryService.findMany(rq);
  }

  @Permission('notification:delivery:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.deliveryService.findOne(rq);
  }
}
