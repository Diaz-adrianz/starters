import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RequestUser } from '../../common/decorators/request-user.decorator';
import { type Session } from '../../common/interfaces/session.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // sign in methods
  @Post('sign-in')
  @UseGuards(LocalGuard)
  signInLocal(@RequestUser() user: User) {
    return this.authService.signIn(user);
  }

  @Get('/me')
  me(@RequestUser() user: Session) {
    return { user };
  }
}
