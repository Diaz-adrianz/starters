import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../entities/activity.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity, DatabaseKeys.DEFAULT)
    private activityRepo: AppRepository<Activity>,
  ) {}

  // Base
  // ----------------------------------------------------------------
  create(dto: CreateActivityDto) {
    return this.activityRepo.insert(dto);
  }

  findMany(rq: ResourceQuery) {
    return this.activityRepo.findAndCount({
      ...rq.toFindOptions(),
      select: {
        id: true,
        createdAt: true,
        actorType: true,
        actorId: true,
        actorName: true,
        module: true,
        action: true,
        status: true,
        targetType: true,
        targetId: true,
        targetName: true,
      },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.activityRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }
}
