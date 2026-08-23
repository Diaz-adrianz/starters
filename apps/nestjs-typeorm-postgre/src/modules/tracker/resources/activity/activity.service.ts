import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../entities/activity.entity';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity, DatabaseKeys.DEFAULT)
    private activityRepo: AppRepository<Activity>,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  create(dto: CreateActivityDto) {
    return this.activityRepo.insert(dto);
  }

  findMany(scope: ResourceScope) {
    return this.activityRepo.findAndCount({
      ...scope.toFindOptions(),
      select: this.activityRepo.select(['metadata'], 'omit'),
    });
  }

  findOne(scope: ResourceScope) {
    return this.activityRepo.findOneOrFail({
      ...scope.toFindOptions(),
    });
  }
}
