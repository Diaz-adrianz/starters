import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ReqUser } from '../../../../common/decorators/req-user.decorator';
import { Principal } from '../../../../shared/classes/principal.class';
import { ResourceScopeDto } from '../../../../shared/dto/resource-scope.dto';

@Controller('notification/deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification-deliveries:create')
  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.create(dto);
  }

  @Permission('notification-deliveries:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.deliveryService.findMany(permission.scope);
  }

  @Permission('notification-deliveries:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.deliveryService.findOne(permission.scope);
  }
}
