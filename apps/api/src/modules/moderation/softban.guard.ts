import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { EnforcementService } from './enforcement.service.js';

@Injectable()
export class SoftBanGuard implements CanActivate {
  constructor(private readonly enforcement: EnforcementService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const userId: string | undefined = req?.user?.userId;
    if (!userId) throw new ForbiddenException('Not authenticated');
    const banned = await this.enforcement.isActive(userId, 'SOFT_BAN');
    if (banned) throw new ForbiddenException({ error: { code: 'FORBIDDEN', message: 'Soft-banned: action not allowed' } } as any);
    return true;
  }
}


