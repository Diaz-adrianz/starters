import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CategoryKeys } from '../constants/category-keys.constant';
import { NotificationData } from '../entities/notification.entity';
import { Type } from 'class-transformer';

const CategoryKeysFlat = Object.values(CategoryKeys);

export class CreateNotificationRecipientDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  userId: string;
}

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsIn(CategoryKeysFlat)
  category: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsObject()
  data?: NotificationData | null;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateNotificationRecipientDto)
  recipients: CreateNotificationRecipientDto[];
}
