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
import { PageService } from './page.service';
import { StoreService } from '../../../../infra/store/store.service';
import { CreatePageDto } from './dto/create-page.dto';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Permission } from '../../decorators/permission.decorator';

@Controller('access-control/pages')
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private store: StoreService,
  ) {}

  // ================================================================
  // Base
  // ----------------------------------------------------------------
  @Permission('access-control:page:create')
  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.pageService.create(dto);
  }

  @Permission('access-control:page:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const scope = this.store.buildResourceScope();
    scope.addQuery(query);
    return this.pageService.findMany(scope);
  }

  @Permission('access-control:page:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.pageService.findOne(scope);
  }

  @Permission('access-control:page:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.pageService.update(scope, dto);
  }

  @Permission('access-control:page:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.pageService.archive(scope);
  }

  @Permission('access-control:page:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.pageService.restore(scope);
  }

  @Permission('access-control:page:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.pageService.delete(scope);
  }
}
