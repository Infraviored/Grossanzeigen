import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: any = ctx.switchToHttp().getRequest();
    const userId: string | undefined = req?.user?.userId;
    if (!userId) throw new ForbiddenException({ error: { code: 'FORBIDDEN', message: 'Not authenticated' } } as any);
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { emailVerifiedAt: true } });
    if (!user?.emailVerifiedAt) {
      throw new ForbiddenException({ error: { code: 'AUTH_UNVERIFIED_EMAIL', message: 'Email not verified' } } as any);
    }
    return true;
  }
}


