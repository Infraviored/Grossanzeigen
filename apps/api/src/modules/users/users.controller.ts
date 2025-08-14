import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, profile: { select: { displayName: true, avatarUrl: true } } },
    });
    return { user };
  }
}


