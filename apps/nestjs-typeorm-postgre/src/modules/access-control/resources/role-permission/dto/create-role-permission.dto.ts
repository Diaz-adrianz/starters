import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { IsConditionObject } from '../../../decorators/validators/is-condition-object.validator';
import { type Condition } from '../../../interfaces/condition.interface';

export class CreateRolePermissionDto {
  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @IsNotEmpty()
  @IsUUID()
  permissionId: string;

  @IsOptional()
  @IsConditionObject()
  condition?: Condition;
}
