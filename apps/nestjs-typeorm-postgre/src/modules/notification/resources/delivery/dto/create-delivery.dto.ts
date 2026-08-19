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
import { Type } from 'class-transformer';
import { DeliveryType } from '../../../enums/delivery-type.enum';
import { DeliveryPriority } from '../../../enums/delivery-priority.enum';

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
  @IsEnum(DeliveryType)
  type: DeliveryType;

  @IsNotEmpty()
  @IsEnum(DeliveryPriority)
  priority: DeliveryPriority;

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
