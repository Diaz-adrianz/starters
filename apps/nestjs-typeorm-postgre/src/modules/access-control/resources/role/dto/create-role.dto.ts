import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  enabled: boolean;
}
