import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service.js';
import { ROLES_KEY, RoleName } from './roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;
    const req = context.switchToHttp().getRequest<any>();
    const userId: string | undefined = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Missing user');
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { roles: true } });
    const userRoles = new Set(user?.roles ?? []);
    return required.some((r) => userRoles.has(r));
  }
}


