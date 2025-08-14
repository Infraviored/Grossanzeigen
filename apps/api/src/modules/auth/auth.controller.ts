import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service.js';

class SignupDto { email!: string; password!: string }
class LoginDto { email!: string; password!: string }
class VerifyDto { token!: string }
class ResendDto { email!: string }

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto.email, dto.password);
  }

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

  @Post('verify')
  async verify(@Body() dto: VerifyDto) {
    return await this.authService.verifyEmail(dto.token);
  }

  @Post('verify/resend')
  async resend(@Body() dto: ResendDto) {
    return await this.authService.resendVerification(dto.email);
  }
}


