import { IsNotEmpty, IsString } from 'class-validator';

export class SignInLocalDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
