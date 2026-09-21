import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { Page } from '../../entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { UpdatePageDto } from './dto/update-page.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page, DatabaseKeys.DEFAULT)
    private pageRepo: AppRepository<Page>,
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

  update(rq: ResourceQuery, dto: UpdatePageDto) {
    return this.pageRepo.update(rq.toFindOptions().where, dto);
  }

  archive(rq: ResourceQuery) {
    return this.pageRepo.softDelete(rq.toFindOptions().where);
  }

  restore(rq: ResourceQuery) {
    return this.pageRepo.restore(rq.toFindOptions().where);
  }

  delete(rq: ResourceQuery) {
    return this.pageRepo.delete(rq.toFindOptions().where);
  }
}
