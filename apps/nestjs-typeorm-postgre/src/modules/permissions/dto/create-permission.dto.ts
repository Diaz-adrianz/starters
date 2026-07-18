import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  resource: string;

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}
