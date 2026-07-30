import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from '../../common/decorators/permission.decorator';
import { ResourceScopeQueryDto } from '../../shared/dto/resource-scope.dto';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Principal } from '../../shared/classes/principal.class';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permission('permissions:create')
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Permission('permissions:find-all')
  @Get()
  findAll(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeQueryDto,
  ) {
    permission.scope.push(query, 'AND');
    return this.permissionsService.findAll(permission.scope.toPageOptions());
  }

  @Permission('permissions:find-one')
  @Get(':id')
  async findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.permissionsService.existByScope(permission.scope);
    return this.permissionsService.findOne(id);
  }

  @Permission('permissions:update')
  @Patch(':id')
  async update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.permissionsService.existByScope(permission.scope);
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Permission('permissions:soft-delete')
  @Delete(':id/soft')
  async softDelete(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
  ) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.permissionsService.existByScope(permission.scope);
    return this.permissionsService.softDelete(id);
  }

  @Permission('permissions:restore')
  @Patch(':id/restore')
  async restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.permissionsService.existByScope(permission.scope);
    return this.permissionsService.restore(id);
  }

  @Permission('permissions:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.permissionsService.existByScope(permission.scope);
    return this.permissionsService.delete(id);
  }
}
