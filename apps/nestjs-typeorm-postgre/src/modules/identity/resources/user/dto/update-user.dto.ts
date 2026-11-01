import { Exclude } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';
import { UserStatus } from '../../../enums/user-status.enum';
import { IsUsername } from '../../../decorators/validators/is-username.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsUsername()
  username?: string;

  @IsOptional()
  @IsIn([UserStatus.ACTIVE, UserStatus.DISABLED])
  status?: UserStatus;

  // Internal
  // --------------------------
  @Exclude()
  avatar?: string | null;
}
