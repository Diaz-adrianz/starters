import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { IsConditionObject } from '../../../decorators/validators/is-condition-object.validator';
import { type Condition } from '../../../interfaces/condition.interface';

export class SetRolePermissionDto {
  @IsNotEmpty()
  @IsBoolean()
  grant: boolean;

  @IsNotEmpty()
  @IsUUID()
  permissionId: string;

  @IsOptional()
  @IsConditionObject()
  condition?: Condition;
}
