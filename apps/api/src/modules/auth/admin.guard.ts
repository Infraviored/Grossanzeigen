import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const userId: string | undefined = req?.user?.userId;
    if (!userId) throw new ForbiddenException('Not authenticated');
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { roles: true } });
    if (!user?.roles?.includes('ADMIN' as any)) {
      throw new ForbiddenException('Admin only');
    }
    return true;
  }
}


