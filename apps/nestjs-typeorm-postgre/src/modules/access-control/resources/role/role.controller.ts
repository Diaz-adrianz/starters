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
import { Permission } from '../../../../common/decorators/permission.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StoreService } from '../../../../infra/store/store.service';

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
    const scope = this.store.buildResourceScope();
    scope.addQuery(query);
    return this.roleService.findMany(scope);
  }

  @Permission('access-control:role:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.findOne(scope);
  }

  @Permission('access-control:role:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.update(scope, updateRoleDto);
  }

  @Permission('access-control:role:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.archive(scope);
  }

  @Permission('access-control:role:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.restore(scope);
  }

  @Permission('access-control:role:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.delete(scope);
  }
}
