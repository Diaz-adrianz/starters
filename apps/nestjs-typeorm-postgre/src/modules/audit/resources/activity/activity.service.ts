import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../entities/activity.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Repository } from 'typeorm';
import { ResourceService } from '../../../../common/services/resource.service';

@Injectable()
export class ActivityService extends ResourceService<Activity> {
  constructor(
    @InjectRepository(Activity, DatabaseKeys.DEFAULT)
    private activityRepo: Repository<Activity>,
  ) {
    super(activityRepo);
  }

  // Base
  // ----------------------------------------------------------------
  create(dto: CreateActivityDto) {
    const data = this.activityRepo.create(dto);
    return this.activityRepo.save(data);
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
