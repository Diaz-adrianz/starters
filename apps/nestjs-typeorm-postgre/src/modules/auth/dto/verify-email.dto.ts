import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @Length(6, 6)
  @IsNumberString()
  otp: string;
}
