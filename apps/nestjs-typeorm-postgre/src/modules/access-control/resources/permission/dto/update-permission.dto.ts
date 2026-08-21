import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  description?: string;

  @ValidateIf((o) => o.enabled !== undefined)
  @IsBoolean()
  enabled?: boolean;
}
