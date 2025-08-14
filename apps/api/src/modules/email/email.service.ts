import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // Dev logger implementation
    // eslint-disable-next-line no-console
    console.log(`[email] verification to=${email} token=${token}`);
  }

  async sendUnusualLoginEmail(email: string, device: { ip?: string; ua?: string }): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`[email] unusual-login to=${email} ip=${device.ip} ua=${device.ua}`);
  }
}


