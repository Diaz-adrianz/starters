import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ReqUser } from '../../../../common/decorators/req-user.decorator';
import { Principal } from '../../../../shared/classes/principal.class';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';

@Controller('notification/deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

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
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceQueryDto,
  ) {
    permission.scope.addQuery(query);
    return this.deliveryService.findMany(permission.scope);
  }

  @Permission('notification:delivery:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.deliveryService.findOne(permission.scope);
  }
}
