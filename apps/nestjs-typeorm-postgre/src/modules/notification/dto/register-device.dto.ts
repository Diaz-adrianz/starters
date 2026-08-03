import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DeviceTokenChannel } from '../entities/device-token.entity';

export class RegisterDeviceDto {
  @IsNotEmpty()
  @IsEnum(DeviceTokenChannel)
  channel: DeviceTokenChannel;

  @IsNotEmpty()
  @IsString()
  token: string;
}
