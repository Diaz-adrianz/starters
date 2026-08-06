import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryKeys } from '../constants/category-keys.constant';
import { MessageData } from '../entities/message.entity';

const CategoryKeysFlat = Object.values(CategoryKeys);

export class CreateMessageDto {
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
  data?: MessageData | null;
}
