import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Channel } from '../../../enums/channel.enum';

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsEnum(Channel)
  channel: Channel;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsString({ each: true })
  availableKeys: string[];

  @IsNotEmpty()
  @IsString({ each: true })
  sensitiveKeys: string[];
}
