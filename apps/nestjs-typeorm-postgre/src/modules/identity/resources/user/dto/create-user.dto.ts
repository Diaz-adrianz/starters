import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { MatchWith } from '../../../../../common/decorators/validators/match-with.validator';
import { IsUsername } from '../../../decorators/validators/is-username.validator';
import { Exclude, Type } from 'class-transformer';
import { UserStatus } from '../../../enums/user-status.enum';

export class CreateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsUsername()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string | null;

  @IsOptional()
  @MatchWith('password')
  matchPassword?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateUserRoleDto)
  roles?: CreateUserRoleDto[];

  // Internal
  // --------------------------
  @Exclude()
  status?: UserStatus;
}
