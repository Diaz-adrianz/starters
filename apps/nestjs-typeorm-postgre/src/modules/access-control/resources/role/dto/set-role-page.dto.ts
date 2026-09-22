import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class SetRolePageDto {
  @IsNotEmpty()
  @IsBoolean()
  assign: boolean;

  @IsNotEmpty()
  @IsUUID()
  pageId: string;
}
