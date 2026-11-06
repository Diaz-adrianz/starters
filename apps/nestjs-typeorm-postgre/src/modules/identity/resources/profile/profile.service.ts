import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile, DatabaseKeys.DEFAULT)
    private profileRepo: AppRepository<Profile>,
  ) {}

  // Base
  // ----------------------------------------------------------------
  create(userId: string, dto: CreateProfileDto) {
    const data = this.profileRepo.create({ ...dto, userId });
    return this.profileRepo.save(data);
  }

  findMany(rq: ResourceQuery) {
    return this.profileRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.profileRepo.select([
          'id',
          'userId',
          'firstName',
          'lastName',
          'gender',
          'createdAt',
        ]),
      },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.profileRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.profileRepo.select('*'),
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  update(rq: ResourceQuery, dto: UpdateProfileDto) {
    return this.profileRepo.update(rq.toFindOptions().where, dto);
  }

  archive(rq: ResourceQuery) {
    return this.profileRepo.softDelete(rq.toFindOptions().where);
  }

  restore(rq: ResourceQuery) {
    return this.profileRepo.restore(rq.toFindOptions().where);
  }

  delete(rq: ResourceQuery) {
    return this.profileRepo.delete(rq.toFindOptions().where);
  }
}
