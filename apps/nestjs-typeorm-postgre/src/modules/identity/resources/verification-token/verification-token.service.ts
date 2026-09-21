import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { VerificationToken } from '../../entities/verification-token.entity';
import { UpdateVerificationTokenDto } from './dto/update-verification-token.dto';
import { CreateVerificationTokenDto } from './dto/create-verification-token.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

@Injectable()
export class VerificationTokenService {
  constructor(
    @InjectRepository(VerificationToken, DatabaseKeys.DEFAULT)
    private verificationTokenRepo: AppRepository<VerificationToken>,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  create(dto: CreateVerificationTokenDto) {
    return this.verificationTokenRepo.save(dto);
  }

  findMany(rq: ResourceQuery) {
    return this.verificationTokenRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.verificationTokenRepo.select('*'),
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.verificationTokenRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }

  update(rq: ResourceQuery, dto: UpdateVerificationTokenDto) {
    return this.verificationTokenRepo.update(rq.toFindOptions().where, dto);
  }

  updateById(id: string, dto: UpdateVerificationTokenDto) {
    const rq = new ResourceQuery([{ field: 'id', op: 'eq', value: id }]);
    return this.update(rq, dto);
  }

  delete(rq: ResourceQuery) {
    return this.verificationTokenRepo.delete(rq.toFindOptions().where);
  }
}
