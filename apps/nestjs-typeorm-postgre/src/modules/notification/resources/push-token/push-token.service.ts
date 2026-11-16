import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from '../../entities/push-token.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { ResourceService } from '../../../../common/services/resource.service';
import { Repository } from 'typeorm';

@Injectable()
export class PushTokenService extends ResourceService<PushToken> {
  constructor(
    @InjectRepository(PushToken, DatabaseKeys.DEFAULT)
    private pushTokenRepo: Repository<PushToken>,
    private logger: LoggerService,
  ) {
    super(pushTokenRepo);
  }

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

  // Base
  // ----------------------------------------------------------------
  async findMany(rq: ResourceQuery) {
    return this.pushTokenRepo.findAndCount({
      ...rq.toFindOptions(),
      select: {
        ...this.select(['token'], 'omit'),
      },
    });
  }

  async delete(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions());
    return this.pushTokenRepo.remove(data);
  }

  // Cron
  // ----------------------------------------------------------------
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupDisabled() {
    const result = await this.pushTokenRepo.delete({ enabled: false });
    this.logger.log(
      `Cleaned ${result.affected ?? 0} push tokens`,
      this.constructor.name,
    );
  }
}
