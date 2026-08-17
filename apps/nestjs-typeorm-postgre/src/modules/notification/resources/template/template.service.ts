import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../../entities/template.entity';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template, DatabaseKeys.DEFAULT)
    private templateRepo: AppRepository<Template>,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  create(dto: CreateTemplateDto) {
    return this.templateRepo.insert(dto);
  }

  findMany(scope: ResourceScope) {
    return this.templateRepo.findAndCount({
      ...scope.toPageOptions(),
      select: this.templateRepo.select(['id', 'key', 'channel', 'title']),
    });
  }

  findOne(scope: ResourceScope) {
    return this.templateRepo.findOneOrFail({
      ...scope.toOptions(),
    });
  }

  update(scope: ResourceScope, dto: UpdateTemplateDto) {
    return this.templateRepo.update(scope.where, dto);
  }

  archive(scope: ResourceScope) {
    return this.templateRepo.softDelete(scope.where);
  }

  restore(scope: ResourceScope) {
    return this.templateRepo.restore(scope.where);
  }

  delete(scope: ResourceScope) {
    return this.templateRepo.delete(scope.where);
  }
}
