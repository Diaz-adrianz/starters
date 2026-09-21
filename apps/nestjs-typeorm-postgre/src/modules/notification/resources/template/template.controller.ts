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
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../../access-control/decorators/permission.decorator';

@Controller('notification/templates')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private store: StoreService,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification:template:create')
  @Post()
  create(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }

  @Permission('notification:template:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.templateService.findMany(rq);
  }

  @Permission('notification:template:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.templateService.findOne(rq);
  }

  @Permission('notification:template:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.templateService.update(rq, dto);
  }

  @Permission('notification:template:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.templateService.archive(rq);
  }

  @Permission('notification:template:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.templateService.restore(rq);
  }

  @Permission('notification:template:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.templateService.delete(rq);
  }
}
