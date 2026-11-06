import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StoreService } from '../../../../infra/store/store.service';
import { AuditActivity } from '../../../audit/decorators/audit-activity.decorator';
import { Permission } from '../../decorators/permission.decorator';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Controller('access-control/role-permissions')
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
    private store: StoreService,
  ) {}

  // Base
  // ----------------------------------------------------------------
  @AuditActivity({ targetId: ({ res }) => res.id })
  @Permission('access-control:role-permission:create')
  @Post()
  create(@Body() dto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(dto);
  }

  @Permission('access-control:role-permission:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store
      .buildResourceQuery()
      .addFromDto(query, 'and', [
        'permission.description',
        'permission.module',
      ]);
    return this.rolePermissionService.findMany(rq);
  }

  @Permission('access-control:role-permission:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.rolePermissionService.findOne(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('access-control:role-permission:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.rolePermissionService.delete(rq);
  }
}
