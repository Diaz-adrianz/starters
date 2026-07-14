import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  // sign in methods
  @Post('sign-in')
  @UseGuards(LocalGuard)
  signInLocal(@Request() req) {
    return req.user;
  }
}
