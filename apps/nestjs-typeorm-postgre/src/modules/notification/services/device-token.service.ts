import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceToken } from '../entities/device-token.entity';
import { CreateDeviceTokenDto } from '../dto/create-device-token.dto';
import { UpdateDeviceTokenDto } from '../dto/update-device-token.dto';
import { AppRepository } from '../../../database/typeorm/app-repository';

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceToken, 'default')
    private deviceTokenRepo: AppRepository<DeviceToken>,
  ) {}

  create(
    deviceId: string,
    createDeviceTokenDto: CreateDeviceTokenDto,
    userId?: string | null,
  ) {
    return this.deviceTokenRepo.upsert(
      { ...createDeviceTokenDto, userId },
      { conflictPaths: ['deviceId', 'channel'] },
    );
  }

  update(
    deviceId: string,
    token: string,
    updateDeviceTokenDto: UpdateDeviceTokenDto,
  ) {
    return this.deviceTokenRepo.update({ token }, updateDeviceTokenDto);
  }

  delete(deviceId: string, token: string) {
    return this.deviceTokenRepo.delete({ token });
  }
}
