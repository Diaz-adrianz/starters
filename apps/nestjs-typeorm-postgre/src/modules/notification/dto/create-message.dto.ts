import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TypeKeys } from '../constants/type-keys.constant';
import { MessageData } from '../entities/message.entity';

const TypeKeysFlat = Object.values(TypeKeys);

export class CreateMessageDto {
  @IsNotEmpty()
  @IsIn(TypeKeysFlat)
  type: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsObject()
  data?: MessageData | null;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  userIds: string[];
}
