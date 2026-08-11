import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  group?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @ValidateIf((o) => o.enabled !== undefined)
  @IsBoolean()
  enabled?: boolean;
}
