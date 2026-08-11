import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceToken } from '../entities/device-token.entity';
import { RegisterDeviceTokenDto } from '../dto/register-device-token.dto';
import { AppRepository } from '../../../database/typeorm/app-repository';
import { Client } from '../../../shared/classes/client.class';

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceToken, 'default')
    private deviceTokenRepo: AppRepository<DeviceToken>,
  ) {}

  register(
    userId: string | undefined,
    registerDeviceTokenDto: RegisterDeviceTokenDto,
    client: Client,
  ) {
    return this.deviceTokenRepo.upsert(
      {
        ...registerDeviceTokenDto,
        userId,
        deviceId: client.deviceId,
        deviceType: client.deviceType,
        deviceName: client.deviceName,
      },
      { conflictPaths: ['channel', 'token'] },
    );
  }

  revoke(id: string) {
    return this.deviceTokenRepo.update({ id }, { isActive: false });
  }

  revokeByToken(token: string) {
    return this.deviceTokenRepo.update({ token }, { isActive: false });
  }
}
