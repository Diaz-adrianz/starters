import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../../entities/template.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Channel } from '../../enums/channel.enum';
import * as Handlebars from 'handlebars';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { ResourceService } from '../../../../common/services/resource.service';
import { Repository } from 'typeorm';

@Injectable()
export class TemplateService extends ResourceService<Template> {
  constructor(
    @InjectRepository(Template, DatabaseKeys.DEFAULT)
    private templateRepo: Repository<Template>,
  ) {
    super(templateRepo);
  }

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

  // Base
  // ----------------------------------------------------------------
  async create(dto: CreateTemplateDto) {
    const data = this.templateRepo.create(dto);
    return this.templateRepo.save(data);
  }

  async findMany(rq: ResourceQuery) {
    return this.templateRepo.findAndCount({
      ...rq.toFindOptions(),
      select: this.select(['id', 'key', 'channel', 'title', 'availableKeys']),
    });
  }

  async findOne(rq: ResourceQuery) {
    return this.templateRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }

  async update(rq: ResourceQuery, dto: UpdateTemplateDto) {
    const data = await this.load(rq.toFindOptions());
    this.templateRepo.merge(data, dto);
    return this.templateRepo.save(data);
  }

  async archive(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions());
    return this.templateRepo.softRemove(data);
  }

  async restore(rq: ResourceQuery) {
    rq.setTrash(true);
    const data = await this.load(rq.toFindOptions());
    return this.templateRepo.recover(data);
  }

  async delete(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions());
    return this.templateRepo.remove(data);
  }
}
