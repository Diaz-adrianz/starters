import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from '../../entities/push-token.entity';
import { DatabaseKeys } from '../../../../database/database-keys.contant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { Client } from '../../../../shared/classes/client.class';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';

@Injectable()
export class PushTokenService {
  constructor(
    @InjectRepository(PushToken, DatabaseKeys.DEFAULT)
    private pushTokenRepo: AppRepository<PushToken>,
  ) {}

  register(
    userId: string | undefined,
    dto: RegisterPushTokenDto,
    client: Client,
  ) {
    return this.pushTokenRepo.upsert(
      {
        ...dto,
        userId,
        deviceId: client.deviceId,
        deviceType: client.deviceType,
        deviceName: client.deviceName,
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
      ...scope.toPageOptions(),
      select: {
        ...this.pushTokenRepo.select(['token'], 'omit'),
      },
    });
  }
}
