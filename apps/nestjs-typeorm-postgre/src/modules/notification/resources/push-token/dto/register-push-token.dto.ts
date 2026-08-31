import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PushProvider } from '../../../enums/push-provider.enum';
import { Exclude } from 'class-transformer';

export class RegisterPushTokenDto {
  @IsNotEmpty()
  @IsEnum(PushProvider)
  provider: PushProvider;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsBoolean()
  enabled: boolean = true;

  @Exclude()
  userId?: string | null;

  @Exclude()
  deviceId?: string | null;

  @Exclude()
  deviceLabel?: string | null;

  @Exclude()
  deviceType?: string | null;

  @Exclude()
  os?: string | null;
}
