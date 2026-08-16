import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceTokenProvider } from '../enums/push-provider.enum';

export class RegisterDeviceTokenDto {
  @IsNotEmpty()
  @IsEnum(DeviceTokenProvider)
  provider: DeviceTokenProvider;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsBoolean()
  enabled: boolean = true;
}
