import { BadRequestException, Injectable } from '@nestjs/common';
import { AcceptInviteCheckDto, AcceptInviteDto } from './dto/accept-invite.dto';
import { TokenService } from './resources/token/token.service';
import { sha256 } from '../../shared/utils/string.util';
import { TokenType } from './enums/token-type.enum';
import { UserService } from './resources/user/user.service';
import { UserStatus } from './enums/user-status.enum';

@Injectable()
export class IdentityService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async acceptInviteCheck(dto: AcceptInviteCheckDto) {
    const otpHash = sha256(dto.otp);

    const token = await this.tokenService
      .findActiveByHash(otpHash, TokenType.INVITATION)
      .catch(() => null);

    if (!token || token.isExpired())
      throw new BadRequestException('OTP invalid or expired');

    return token;
  }

  async acceptInvite(dto: AcceptInviteDto) {
    const token = await this.acceptInviteCheck(dto);
    await this.userService.updatePasswordById(token.userId, dto.password);
    await this.userService.updateStatusById(token.userId, UserStatus.ACTIVE);
    await this.tokenService.markConsumed(token.id);
    return token;
  }
}
