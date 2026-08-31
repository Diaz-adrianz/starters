import { Exclude } from 'class-transformer';

export class UpdateVerificationTokenDto {
  @Exclude()
  tokenHash?: string;

  @Exclude()
  expiresAt?: Date;

  @Exclude()
  sentAt?: Date | null;

  @Exclude()
  consumedAt?: Date | null;
}
