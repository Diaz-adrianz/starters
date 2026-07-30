import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ResourceScopeDto } from '../../../shared/dto/resource-scope.dto';

export enum UpdateRolePermissionsAction {
  SET = 'set',
  REMOVE = 'remove',
  ADD = 'add',
}

export class UpdateRolePermissionDto {
  @IsUUID()
  permissionId: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ResourceScopeDto)
  scope?: ResourceScopeDto;
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
