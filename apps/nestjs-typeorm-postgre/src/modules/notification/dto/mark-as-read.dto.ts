import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class MarkAsReadDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  notificationIds: string[];

  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;
}
