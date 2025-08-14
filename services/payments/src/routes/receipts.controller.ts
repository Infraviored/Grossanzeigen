import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReceiptsService } from '../services/receipts.service';

@Controller('payments/receipts')
export class ReceiptsController {
  constructor(private readonly receipts: ReceiptsService) {}

  @Get('simple.pdf')
  @Header('Content-Type', 'application/pdf')
  async simple(
    @Query('orderId') orderId: string,
    @Query('listingTitle') listingTitle: string,
    @Query('buyerEmail') buyerEmail: string,
    @Query('sellerEmail') sellerEmail: string,
    @Query('amountMinor') amountMinor: string,
    @Query('currency') currency: string,
    @Res() res: Response,
  ) {
    const buffer = await this.receipts.generateSimpleReceipt({
      orderId,
      listingTitle,
      buyerEmail,
      sellerEmail,
      amountMinor: Number(amountMinor),
      currency,
    });
    res.setHeader('Content-Disposition', `inline; filename="receipt-${orderId}.pdf"`);
    res.send(buffer);
  }
}


