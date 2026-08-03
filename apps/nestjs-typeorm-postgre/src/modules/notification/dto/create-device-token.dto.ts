import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceTokenChannel } from '../entities/device-token.entity';

export class CreateDeviceTokenDto {
  @IsNotEmpty()
  @IsEnum(DeviceTokenChannel)
  channel: DeviceTokenChannel;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;
}
