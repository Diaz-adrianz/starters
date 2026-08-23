import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActivityLevel } from '../../../enums/activity-level.enum';
import { ActorType } from '../../../enums/actor-type.enum';

export class CreateActivityDto {
  @IsNotEmpty()
  @IsEnum(ActivityLevel)
  level: ActivityLevel;

  @IsNotEmpty()
  @IsString()
  module: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsNotEmpty()
  @IsEnum(ActorType)
  actorType: ActorType;

  @IsOptional()
  @IsString()
  actorId: string | null;

  @IsOptional()
  @IsString()
  actorName: string | null;

  @IsOptional()
  @IsString()
  targetType: string | null;

  @IsOptional()
  @IsString()
  targetId: string | null;

  @IsOptional()
  @IsString()
  targetName: string | null;

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsOptional()
  @IsObject()
  metadata: Record<string, any> | null;
}
