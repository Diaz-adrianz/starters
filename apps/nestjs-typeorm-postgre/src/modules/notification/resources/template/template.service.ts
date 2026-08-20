import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../../entities/template.entity';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Channel } from '../../enums/channel.enum';
import * as Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template, DatabaseKeys.DEFAULT)
    private templateRepo: AppRepository<Template>,
  ) {}

  async render(key: string, channel: Channel, payload: Record<string, any>) {
    const data = await this.templateRepo.findOneOrFail({
      where: { key, channel },
    });

    const title = Handlebars.compile(data?.title),
      body = Handlebars.compile(data?.body);

    return {
      ...data,
      title: title(payload),
      body: body(payload),
      maskedPayload: this.maskPayload(payload, data.sensitiveKeys),
    };
  }

  maskPayload(
    obj: Record<string, any>,
    sensitiveKeys: string[],
  ): Record<string, any> {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        sensitiveKeys.includes(key) ? '*'.repeat(String(value).length) : value,
      ]),
    );
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  create(dto: CreateTemplateDto) {
    return this.templateRepo.insert(dto);
  }

  findMany(scope: ResourceScope) {
    return this.templateRepo.findAndCount({
      ...scope.toFindOptions(),
      select: this.templateRepo.select([
        'id',
        'key',
        'channel',
        'title',
        'availableKeys',
      ]),
    });
  }

  findOne(scope: ResourceScope) {
    return this.templateRepo.findOneOrFail({
      ...scope.toFindOptions(),
    });
  }

  update(scope: ResourceScope, dto: UpdateTemplateDto) {
    return this.templateRepo.update(scope.toFindOptions().where, dto);
  }

  archive(scope: ResourceScope) {
    return this.templateRepo.softDelete(scope.toFindOptions().where);
  }

  restore(scope: ResourceScope) {
    return this.templateRepo.restore(scope.toFindOptions().where);
  }

  delete(scope: ResourceScope) {
    return this.templateRepo.delete(scope.toFindOptions().where);
  }
}
