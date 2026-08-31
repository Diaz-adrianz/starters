import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Channel } from '../../../enums/channel.enum';
import { Type } from 'class-transformer';
import { DeliveryType } from '../../../enums/delivery-type.enum';
import { DeliveryPriority } from '../../../enums/delivery-priority.enum';
import { DeliverySender } from '../../../entities/delivery.entity';
import { IsOptionalNonNull } from '../../../../../common/decorators/validators/is-optional-non-null.validator';

class CreateDeliverySenderDto implements DeliverySender {
  @IsOptionalNonNull()
  @IsString()
  name?: string;

  @IsOptionalNonNull()
  @IsString()
  email?: string;

  @IsOptionalNonNull()
  @IsEmail()
  emailReplyTo?: string;
}

class CreateDeliveryRecipientDto {
  @IsOptionalNonNull()
  @IsUUID()
  userId?: string;

  @IsOptionalNonNull()
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

  @IsOptionalNonNull()
  @ValidateNested()
  @IsObject()
  @Type(() => CreateDeliverySenderDto)
  sender?: CreateDeliverySenderDto;
}
