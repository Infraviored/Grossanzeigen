import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';

class CreateOrderDto {
  @IsUUID()
  listingId!: string;
}

@UseGuards(SessionAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() body: CreateOrderDto, req: any) {
    const buyerId: string = req.user.userId;
    const listing = await this.prisma.listing.findUnique({ where: { id: body.listingId }, select: { id: true, sellerId: true, price: true, currency: true } });
    if (!listing) throw new Error('Listing not found');
    const order = await this.prisma.order.create({
      data: {
        buyerId,
        sellerId: listing.sellerId,
        listingId: listing.id,
        amountTotal: listing.price,
        currency: listing.currency,
        state: 'CREATED' as any,
      },
    });
    return { order };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    return { order };
  }
}


