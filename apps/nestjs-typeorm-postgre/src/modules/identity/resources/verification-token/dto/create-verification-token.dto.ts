import { Exclude } from 'class-transformer';
import { VerificationTokenType } from '../../../enums/verification-token-type.enum';

export class CreateVerificationTokenDto {
  @Exclude()
  userId: string;

  @Exclude()
  type: VerificationTokenType;

  @Exclude()
  tokenHash: string;

  @Exclude()
  expiresAt: Date;
}
