import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Channel } from '../../../enums/channel.enum';
import { Type as NotificationType } from '../../../enums/delivery-type.enum';
import { Type } from 'class-transformer';

class CreateDeliveryRecipientDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsObject()
  payload: Record<string, any>;
}

export class CreateDeliveryDto {
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNotEmpty()
  @IsString()
  templateKey: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(Channel, { each: true })
  channels: Channel[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryRecipientDto)
  recipients: CreateDeliveryRecipientDto[];
}
