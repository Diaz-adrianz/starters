import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SetUserRoleDto {
  @IsUUID()
  roleId: string;
}

export class SetUserRolesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetUserRoleDto)
  roles: SetUserRoleDto[];
}
