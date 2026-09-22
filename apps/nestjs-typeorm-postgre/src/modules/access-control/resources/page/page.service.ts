import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { Page } from '../../entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { UpdatePageDto } from './dto/update-page.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { EventService } from '../../../../infra/event/event.service';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page, DatabaseKeys.DEFAULT)
    private pageRepo: AppRepository<Page>,
    private event: EventService,
  ) {}

  // ================================================================
  // Base
  // ----------------------------------------------------------------
  create(dto: CreatePageDto) {
    return this.pageRepo.insert(dto);
  }

  findMany(rq: ResourceQuery) {
    return this.pageRepo.findAndCount({
      ...rq.toFindOptions(),
      select: this.pageRepo.select(['id', 'name', 'description', 'enabled']),
    });
  }

  findOne(rq: ResourceQuery) {
    return this.pageRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }

  async update(rq: ResourceQuery, dto: UpdatePageDto) {
    const result = await this.pageRepo.update(rq.toFindOptions().where, dto, {
      returning: ['id'],
    });
    this.event.emit('accessControl.page.updated', {
      target: result.raw as Pick<Page, 'id'>[],
    });
    return result;
  }

  async archive(rq: ResourceQuery) {
    const result = await this.pageRepo.softDelete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.page.updated', {
      target: result.raw as Pick<Page, 'id'>[],
    });
    return result;
  }

  async restore(rq: ResourceQuery) {
    const result = await this.pageRepo.restore(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.page.updated', {
      target: result.raw as Pick<Page, 'id'>[],
    });
    return result;
  }

  async delete(rq: ResourceQuery) {
    const result = await this.pageRepo.delete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('accessControl.page.deleted', {
      target: result.raw as Pick<Page, 'id'>[],
    });
    return result;
  }
}
