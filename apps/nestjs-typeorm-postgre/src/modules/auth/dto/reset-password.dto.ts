import {
  IsNotEmpty,
  IsNumberString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { MatchWith } from '../../../common/decorators/validators/match-with.validator';

export class ResetPasswordCheckDto {
  @IsNotEmpty()
  @Length(6, 6)
  @IsNumberString()
  otp: string;
}

export class ResetPasswordDto extends ResetPasswordCheckDto {
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @MatchWith('password')
  matchPassword: string;
}
