import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const [k, ...v] = part.split('=');
    const key = k?.trim();
    const value = v.join('=').trim();
    if (key) out[key] = decodeURIComponent(value ?? '');
  });
  return out;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();
    const cookieHeader = req.headers['cookie'];
    const cookies = parseCookies(typeof cookieHeader === 'string' ? cookieHeader : undefined);
    let token = cookies['session'];
    if (!token) {
      const auth = req.headers['authorization'];
      if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
        token = auth.slice('Bearer '.length);
      }
    }
    if (!token) throw new UnauthorizedException('Missing session');
    const session = await this.prisma.session.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid session');
    }
    req.user = { userId: session.userId, sessionToken: token };
    return true;
  }
}


