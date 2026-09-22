import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SetRoleUserDto {
  @IsNotEmpty()
  @IsBoolean()
  assign: boolean;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
