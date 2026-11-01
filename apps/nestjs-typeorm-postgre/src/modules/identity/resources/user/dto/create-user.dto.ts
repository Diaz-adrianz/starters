import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { MatchWith } from '../../../../../common/decorators/validators/match-with.validator';
import { IsUsername } from '../../../decorators/validators/is-username.validator';
import { Exclude } from 'class-transformer';
import { UserStatus } from '../../../enums/user-status.enum';

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
  @IsString()
  roleName?: string;

  // Internal
  // --------------------------
  @Exclude()
  status?: UserStatus;
}
