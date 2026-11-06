import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../../entities/template.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Channel } from '../../enums/channel.enum';
import * as Handlebars from 'handlebars';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

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
    const data = this.templateRepo.create(dto);
    return this.templateRepo.save(data);
  }

  findMany(rq: ResourceQuery) {
    return this.templateRepo.findAndCount({
      ...rq.toFindOptions(),
      select: this.templateRepo.select([
        'id',
        'key',
        'channel',
        'title',
        'availableKeys',
      ]),
    });
  }

  findOne(rq: ResourceQuery) {
    return this.templateRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }

  update(rq: ResourceQuery, dto: UpdateTemplateDto) {
    return this.templateRepo.update(rq.toFindOptions().where, dto);
  }

  archive(rq: ResourceQuery) {
    return this.templateRepo.softDelete(rq.toFindOptions().where);
  }

  restore(rq: ResourceQuery) {
    return this.templateRepo.restore(rq.toFindOptions().where);
  }

  delete(rq: ResourceQuery) {
    return this.templateRepo.delete(rq.toFindOptions().where);
  }
}
