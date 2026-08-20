import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Scope } from '../../../shared/interfaces/resource-scope.interface';

export enum UpdateRolePermissionsAction {
  SET = 'set',
  REM = 'rem',
  ADD = 'add',
}

export class UpdateRolePermissionDto {
  @IsNotEmpty()
  @IsUUID()
  permissionId: string;

  @IsOptional()
  @IsObject()
  scope?: Scope | null;
}

export class UpdateRolePermissionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateRolePermissionDto)
  items: UpdateRolePermissionDto[];

  @IsNotEmpty()
  @IsEnum(UpdateRolePermissionsAction)
  action: UpdateRolePermissionsAction;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => UpdateRolePermissionsDto)
  permissions?: UpdateRolePermissionsDto;
}
