import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { MatchWith } from '../../../common/decorators/match-with.decorator';

export class ResetPasswordCheckDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ResetPasswordDto extends ResetPasswordCheckDto {
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @MatchWith('password')
  matchPassword: string;
}
