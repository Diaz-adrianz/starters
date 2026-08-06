import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMessageDto } from './create-message.dto';

class CreateNotificationUserDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  id: string;
}

export class CreateNotificationDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateMessageDto)
  message: CreateMessageDto;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateNotificationUserDto)
  users: CreateNotificationUserDto[];
}
