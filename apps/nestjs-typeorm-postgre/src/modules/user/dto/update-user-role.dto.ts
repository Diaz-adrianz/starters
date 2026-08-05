import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UpdateUserRolesAction {
  SET = 'set',
  REMOVE = 'remove',
  ADD = 'add',
}

export class UpdateUserRoleDto {
  @IsUUID()
  roleId: string;
}

export class UpdateUserRolesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserRoleDto)
  roles: UpdateUserRoleDto[];

  @IsNotEmpty()
  @IsEnum(UpdateUserRolesAction)
  action: UpdateUserRolesAction;
}
