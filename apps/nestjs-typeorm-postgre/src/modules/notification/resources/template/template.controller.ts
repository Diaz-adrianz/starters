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
import { TemplateService } from './template.service';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ReqUser } from '../../../../common/decorators/req-user.decorator';
import { ResourceScopeDto } from '../../../../shared/dto/resource-scope.dto';
import { Principal } from '../../../../shared/classes/principal.class';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('notification/templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification-templates:create')
  @Post()
  create(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }

  @Permission('notification-templates:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.templateService.findMany(permission.scope);
  }

  @Permission('notification-templates:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.templateService.findOne(permission.scope);
  }

  @Permission('notification-templates:update')
  @Patch(':id')
  update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    return this.templateService.update(permission.scope, dto);
  }

  @Permission('notification-templates:archive')
  @Patch(':id/archive')
  archive(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.templateService.archive(permission.scope);
  }

  @Permission('notification-templates:restore')
  @Patch(':id/restore')
  restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.templateService.restore(permission.scope);
  }

  @Permission('notification-templates:delete')
  @Delete(':id')
  delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.templateService.delete(permission.scope);
  }
}
