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
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../decorators/permission.decorator';

@Controller('access-control/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private store: StoreService,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('access-control:role:create')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Permission('access-control:role:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.roleService.findMany(rq);
  }

  @Permission('access-control:role:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.roleService.findOne(rq);
  }

  @Permission('access-control:role:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.roleService.update(rq, updateRoleDto);
  }

  @Permission('access-control:role:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.roleService.archive(rq);
  }

  @Permission('access-control:role:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.roleService.restore(rq);
  }

  @Permission('access-control:role:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.roleService.delete(rq);
  }
}
