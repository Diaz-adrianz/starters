import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUsername } from '../../../decorators/validators/is-username.validator';

export class InviteUserDto {
  @IsNotEmpty()
  @IsUsername()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  roleName?: string;
}
