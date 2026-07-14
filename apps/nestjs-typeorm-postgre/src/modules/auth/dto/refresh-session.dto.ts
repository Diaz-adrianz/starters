import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshSessionDto {
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
