import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceTokenProvider } from '../entities/device-token.entity';

export class RegisterDeviceTokenDto {
  @IsNotEmpty()
  @IsEnum(DeviceTokenProvider)
  channel: DeviceTokenProvider;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsBoolean()
  enabled: boolean = true;
}
