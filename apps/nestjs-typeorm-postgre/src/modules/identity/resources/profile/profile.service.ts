import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResourceService } from '../../../../common/services/resource.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService extends ResourceService<Profile> {
  constructor(
    @InjectRepository(Profile, DatabaseKeys.DEFAULT)
    private profileRepo: Repository<Profile>,
  ) {
    super(profileRepo);
  }

  // Base
  // ----------------------------------------------------------------
  async create(userId: string, dto: CreateProfileDto) {
    const data = this.profileRepo.create({ ...dto, userId });
    return this.profileRepo.save(data);
  }

  async findMany(rq: ResourceQuery) {
    return this.profileRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.select([
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

  async findOne(rq: ResourceQuery) {
    return this.profileRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.select('*'),
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  async update(rq: ResourceQuery, dto: UpdateProfileDto) {
    const data = await this.load(rq.toFindOptions());
    this.profileRepo.merge(data, dto);
    return this.profileRepo.save(data);
  }

  async archive(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions());
    return this.profileRepo.softRemove(data);
  }

  async restore(rq: ResourceQuery) {
    rq.setTrash(true);
    const data = await this.load(rq.toFindOptions());
    return this.profileRepo.recover(data);
  }

  async delete(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions());
    return this.profileRepo.remove(data);
  }
}
