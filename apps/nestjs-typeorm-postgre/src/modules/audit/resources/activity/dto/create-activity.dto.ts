import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActorType } from '../../../enums/actor-type.enum';
import { ActivityStatus } from '../../../enums/activity-status.enum';
import {
  ActivityChanges,
  ActivityMeta,
} from '../../../entities/activity.entity';

export class ActivityContextDto {
  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class CreateActivityDto {
  @IsEnum(ActorType)
  actorType: ActorType;

  @IsOptional()
  @IsString()
  actorId?: string | null;

  @IsOptional()
  @IsString()
  actorName?: string | null;

  @IsString()
  module: string;

  @IsString()
  action: string;

  @IsOptional()
  @IsEnum(ActivityStatus)
  status?: ActivityStatus;

  @IsOptional()
  @IsString()
  targetType?: string | null;

  @IsOptional()
  @IsString()
  targetId?: string | null;

  @IsOptional()
  @IsString()
  targetName?: string | null;

  @IsOptional()
  @IsString()
  requestId?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ActivityContextDto)
  context?: ActivityContextDto | null;

  @IsOptional()
  @IsObject()
  changes?: ActivityChanges | null;

  @IsOptional()
  @IsObject()
  meta?: ActivityMeta | null;
}
