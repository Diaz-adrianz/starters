import { Exclude, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum UpdateUserRolesAction {
  SET = 'set',
  REM = 'rem',
  ADD = 'add',
}

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}

export class UpdateUserRolesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateUserRoleDto)
  items: UpdateUserRoleDto[];

  @IsNotEmpty()
  @IsEnum(UpdateUserRolesAction)
  action: UpdateUserRolesAction;
}

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z][a-zA-Z0-9._]*$/, {
    message:
      'Username must start with a letter and contain only letters, numbers, dots, or underscores',
  })
  username?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => UpdateUserRolesDto)
  roles?: UpdateUserRolesDto;

  // ==========================
  // Internal data
  // --------------------------
  @Exclude()
  avatar?: string | null;

  @Exclude()
  verifiedAt?: Date | null;

  @Exclude()
  verificationSentAt?: Date | null;

  @Exclude()
  resetPasswordSentAt?: Date | null;
}
