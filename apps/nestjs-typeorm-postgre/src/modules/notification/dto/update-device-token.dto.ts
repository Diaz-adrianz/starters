import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDeviceTokenDto {
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
