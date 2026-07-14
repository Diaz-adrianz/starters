import { IsJWT, IsNotEmpty } from 'class-validator';

export class SignOutDto {
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
