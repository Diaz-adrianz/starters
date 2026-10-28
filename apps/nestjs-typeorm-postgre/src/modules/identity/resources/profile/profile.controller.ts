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
import { ProfileService } from './profile.service';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../../access-control/decorators/permission.decorator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuditActivity } from '../../../audit/decorators/audit-activity.decorator';

@Controller('identity/profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private store: StoreService,
  ) {}

  // Base
  // ----------------------------------------------------------------
  @AuditActivity({ targetId: ({ res }) => res.id })
  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(this.store.actor.id, dto);
  }

  @Get('me')
  findMe() {
    const rq = this.store
      .buildResourceQuery()
      .add([['userId', 'eq', this.store.actor.id]]);
    return this.profileService.findOne(rq);
  }

  @Permission('identity:profile:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.profileService.findMany(rq);
  }

  @Permission('identity:profile:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.profileService.findOne(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('identity:profile:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.profileService.update(rq, dto);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('identity:profile:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.profileService.archive(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('identity:profile:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.profileService.restore(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('identity:profile:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.profileService.delete(rq);
  }
}
