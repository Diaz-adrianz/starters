import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordCheckDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
