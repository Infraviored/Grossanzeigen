import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service.js';
// import { RateLimitGuard } from '../ratelimit/ratelimit.guard.js';

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

class SignupDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
}
class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
}
class VerifyDto { @IsString() @IsNotEmpty() token!: string }
class ResendDto { @IsEmail() email!: string }

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(RateLimitGuard)
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto.email, dto.password);
  }

  // @UseGuards(RateLimitGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const userAgent = res.req.headers['user-agent'];
    const ipAddress = (res.req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || res.req.socket.remoteAddress || undefined;
    const { user, session } = await this.authService.login(dto.email, dto.password, userAgent, typeof ipAddress === 'string' ? ipAddress : undefined);
    res.cookie('session', session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      expires: session.expiresAt,
    });
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    const token = res.req.cookies?.session as string | undefined;
    if (token) await this.authService.logout(token);
    res.clearCookie('session');
    return { success: true };
  }

  // @UseGuards(RateLimitGuard)
  @Post('verify')
  async verify(@Body() dto: VerifyDto) {
    return await this.authService.verifyEmail(dto.token);
  }

  // @UseGuards(RateLimitGuard)
  @Post('verify/resend')
  async resend(@Body() dto: ResendDto) {
    return await this.authService.resendVerification(dto.email);
  }
}


