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
    permission.scope.add(query);
    return this.permissionsService.findAll(permission.scope.toPageOptions());
  }

  @Permission('permissions:find-one')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.permissionsService.findOne(permission.scope.toOptions());
  }

  @Permission('permissions:update')
  @Patch(':id')
  async update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.permissionsService.findOne(permission.scope.toOptions());
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Permission('permissions:soft-delete')
  @Delete(':id/soft')
  async softDelete(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.permissionsService.findOne(permission.scope.toOptions());
    return this.permissionsService.softDelete(id);
  }

  @Permission('permissions:restore')
  @Patch(':id/restore')
  async restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    await this.permissionsService.findOne(permission.scope.toOptions());
    return this.permissionsService.restore(id);
  }

  @Permission('permissions:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    await this.permissionsService.findOne(permission.scope.toOptions());
    return this.permissionsService.delete(id);
  }
}
