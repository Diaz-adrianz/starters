import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RequestUser } from '../../common/decorators/request-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RequestClientInfo } from '../../common/decorators/request-client-info.decorator';
import type { ClientInfo } from '../../common/interfaces/client-info.interface';
import type { Session } from '../../common/interfaces/session.interface';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { SignOutDto } from './dto/sign-out.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // sign in methods
  @Public()
  @UseGuards(LocalGuard)
  @Post('sign-in')
  signInLocal(
    @RequestClientInfo() clientInfo: ClientInfo,
    @RequestUser() user: User,
  ) {
    return this.authService.signIn(user, clientInfo);
  }

  @Public()
  @Post('/refresh')
  refreshSession(@Body() refreshSessionDto: RefreshSessionDto) {
    return this.authService.refreshSession(refreshSessionDto);
  }

  @Public()
  @Post('/sign-out')
  signOut(@Body() signOutDto: SignOutDto) {
    return this.authService.signOut(signOutDto);
  }

  @Get('/me')
  me(@RequestUser() session: Session) {
    return { session };
  }
}
