import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query('parentId') parentId?: string) {
    const categories = await this.prisma.category.findMany({
      where: { parentId: parentId ?? null },
      select: { id: true, parentId: true, name: true },
      orderBy: { name: 'asc' },
      take: 200,
    });
    return { categories };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true, parentId: true, name: true, attributeSchema: true },
    });
    return { category };
  }
}


