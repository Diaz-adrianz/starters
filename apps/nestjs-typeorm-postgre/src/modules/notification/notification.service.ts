import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepo: Repository<DeviceToken>,
  ) {}

  registerDevice(userId: string, { channel, token }: RegisterDeviceDto) {
    return this.deviceTokenRepo.upsert(
      { channel, token, userId, isActive: true },
      { conflictPaths: ['channel', 'token', 'userId'] },
    );
  }

  unregisterDevice(userId: string, token: string) {
    return this.deviceTokenRepo.update({ userId, token }, { isActive: false });
  }
}
