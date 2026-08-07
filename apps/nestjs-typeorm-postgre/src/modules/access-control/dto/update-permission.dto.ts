import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  group?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}
