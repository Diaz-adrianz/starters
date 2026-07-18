import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UpdateRolePermissionsAction {
  SET = 'set',
  REMOVE = 'remove',
  ADD = 'add',
}

export class UpdateRolePermissionDto {
  @IsUUID()
  permissionId: string;
}

export class UpdateRolePermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRolePermissionDto)
  permissions: UpdateRolePermissionDto[];

  @IsNotEmpty()
  @IsEnum(UpdateRolePermissionsAction)
  action: UpdateRolePermissionsAction;
}
