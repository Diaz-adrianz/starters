import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRoleUserDto {
  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
