import { BadRequestException, Injectable } from '@nestjs/common';
import { AcceptInviteCheckDto, AcceptInviteDto } from './dto/accept-invite.dto';
import { TokenService } from './resources/token/token.service';
import { sha256 } from '../../shared/utils/string.util';
import { TokenType, TokenTypeExpire } from './enums/token-type.enum';
import { UserService } from './resources/user/user.service';
import { UserStatus } from './enums/user-status.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SetPasswordCheckDto, SetPasswordDto } from './dto/set-password.dto';

@Injectable()
export class IdentityService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService
      .findByUsernameOrEmail(dto.email)
      .catch(() => null);
    if (!user) return;

    const token = await this.tokenService
      .findActiveByUser(user.id, TokenType.SET_PASSWORD)
      .catch(() => undefined);

    if (!token || !token.isFresh(TokenTypeExpire.set_password * 1000))
      await this.userService.issueSetPassword(user, token);
  }

  async setPasswordCheck(dto: SetPasswordCheckDto) {
    const otpHash = sha256(dto.otp);

    const token = await this.tokenService
      .findActiveByHash(otpHash, TokenType.SET_PASSWORD)
      .catch(() => null);

    if (!token || token.isExpired())
      throw new BadRequestException('OTP invalid or expired');

    return token;
  }

  async setPassword(dto: SetPasswordDto) {
    const token = await this.setPasswordCheck(dto);
    await this.userService.updateById(token.userId, { password: dto.password });
    await this.tokenService.markConsumed(token.id);
    return token;
  }

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
    await this.userService.updateById(token.userId, {
      password: dto.password,
      status: UserStatus.ACTIVE,
    });
    await this.tokenService.markConsumed(token.id);
    return token;
  }
}
