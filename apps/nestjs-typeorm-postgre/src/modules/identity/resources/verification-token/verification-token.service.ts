import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { VerificationToken } from '../../entities/verification-token.entity';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { UpdateVerificationTokenDto } from './dto/update-verification-token.dto';
import { CreateVerificationTokenDto } from './dto/create-verification-token.dto';

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

  findMany(scope: ResourceScope) {
    return this.verificationTokenRepo.findAndCount({
      ...scope.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.verificationTokenRepo.select('*'),
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  findOne(scope: ResourceScope) {
    return this.verificationTokenRepo.findOneOrFail({
      ...scope.toFindOptions(),
    });
  }

  update(scope: ResourceScope, dto: UpdateVerificationTokenDto) {
    return this.verificationTokenRepo.update(scope.toFindOptions().where, dto);
  }

  updateById(id: string, dto: UpdateVerificationTokenDto) {
    const scope = new ResourceScope([{ field: 'id', op: 'where', value: id }]);
    return this.update(scope, dto);
  }

  delete(scope: ResourceScope) {
    return this.verificationTokenRepo.delete(scope.toFindOptions().where);
  }
}
