import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';

@Controller('notification/deliveries')
export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    private store: StoreService,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification:delivery:create')
  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.create(dto);
  }

  @Permission('notification:delivery:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const scope = this.store.buildResourceScope();
    scope.addQuery(query);
    return this.deliveryService.findMany(scope);
  }

  @Permission('notification:delivery:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.deliveryService.findOne(scope);
  }
}
