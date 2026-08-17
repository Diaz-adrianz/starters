import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PushProvider } from '../../../enums/push-provider.enum';

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
}
