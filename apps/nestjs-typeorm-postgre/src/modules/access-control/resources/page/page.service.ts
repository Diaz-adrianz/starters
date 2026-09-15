import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { Page } from '../../entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { UpdatePageDto } from './dto/update-page.dto';

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

  findMany(scope: ResourceScope) {
    return this.pageRepo.findAndCount({
      ...scope.toFindOptions(),
      select: this.pageRepo.select(['id', 'name', 'description', 'enabled']),
    });
  }

  findOne(scope: ResourceScope) {
    return this.pageRepo.findOneOrFail({
      ...scope.toFindOptions(),
    });
  }

  update(scope: ResourceScope, dto: UpdatePageDto) {
    return this.pageRepo.update(scope.toFindOptions().where, dto);
  }

  archive(scope: ResourceScope) {
    return this.pageRepo.softDelete(scope.toFindOptions().where);
  }

  restore(scope: ResourceScope) {
    return this.pageRepo.restore(scope.toFindOptions().where);
  }

  delete(scope: ResourceScope) {
    return this.pageRepo.delete(scope.toFindOptions().where);
  }
}
