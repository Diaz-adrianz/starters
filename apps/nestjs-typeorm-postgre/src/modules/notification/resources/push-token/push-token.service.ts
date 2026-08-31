import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from '../../entities/push-token.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';

@Injectable()
export class PushTokenService {
  constructor(
    @InjectRepository(PushToken, DatabaseKeys.DEFAULT)
    private pushTokenRepo: AppRepository<PushToken>,
  ) {}

  register(dto: RegisterPushTokenDto) {
    return this.pushTokenRepo.upsert(dto, {
      conflictPaths: ['provider', 'token'],
    });
  }

  revoke(id: string) {
    return this.pushTokenRepo.update({ id }, { enabled: false });
  }

  revokeByToken(token: string) {
    return this.pushTokenRepo.update({ token }, { enabled: false });
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  findMany(scope: ResourceScope) {
    return this.pushTokenRepo.findAndCount({
      ...scope.toFindOptions(),
      select: {
        ...this.pushTokenRepo.select(['token'], 'omit'),
      },
    });
  }
}
