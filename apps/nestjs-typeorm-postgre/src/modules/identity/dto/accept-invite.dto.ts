import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsOtp } from '../../../common/decorators/validators/is-otp.validator';
import { MatchWith } from '../../../common/decorators/validators/match-with.validator';

export class AcceptInviteCheckDto {
  @IsNotEmpty()
  @IsOtp()
  otp: string;
}

export class AcceptInviteDto extends AcceptInviteCheckDto {
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @MatchWith('password')
  matchPassword: string;
}
