import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from '../../entities/push-token.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
// import { StoreService } from '../../../../infra/store/store.service';

@Injectable()
export class PushTokenService {
  constructor(
    @InjectRepository(PushToken, DatabaseKeys.DEFAULT)
    private pushTokenRepo: AppRepository<PushToken>,
    // private store: StoreService,
  ) {}

  register(userId: string | undefined, dto: RegisterPushTokenDto) {
    // const device = this.store.get('device');
    return this.pushTokenRepo.upsert(
      {
        ...dto,
        userId,
        // deviceId: device?.id,
        // deviceType: device?.type,
        // deviceName: device?.deviceName,
      },
      { conflictPaths: ['provider', 'token'] },
    );
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
