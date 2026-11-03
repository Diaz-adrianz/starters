import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IsUsername } from '../../../decorators/validators/is-username.validator';
import { Type } from 'class-transformer';
import { CreateUserRoleDto } from './create-user.dto';

export class InviteUserDto {
  @IsNotEmpty()
  @IsUsername()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateUserRoleDto)
  roles?: CreateUserRoleDto[];
}
