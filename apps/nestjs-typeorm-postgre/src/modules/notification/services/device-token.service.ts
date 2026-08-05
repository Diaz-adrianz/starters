import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceToken } from '../entities/device-token.entity';
import { Repository } from 'typeorm';
import { CreateDeviceTokenDto } from '../dto/create-device-token.dto';
import { UpdateDeviceTokenDto } from '../dto/update-device-token.dto';

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepo: Repository<DeviceToken>,
  ) {}

  create(
    deviceId: string,
    createDeviceTokenDto: CreateDeviceTokenDto,
    userId?: string | null,
  ) {
    return this.deviceTokenRepo.upsert(
      { deviceId, ...createDeviceTokenDto, userId },
      { conflictPaths: ['deviceId', 'channel'] },
    );
  }

  update(
    deviceId: string,
    token: string,
    updateDeviceTokenDto: UpdateDeviceTokenDto,
  ) {
    return this.deviceTokenRepo.update(
      { deviceId, token },
      updateDeviceTokenDto,
    );
  }

  delete(deviceId: string, token: string) {
    return this.deviceTokenRepo.delete({ deviceId, token });
  }
}
