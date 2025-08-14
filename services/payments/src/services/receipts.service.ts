import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReceiptsService {
  generateSimpleReceipt(params: {
    orderId: string;
    listingTitle: string;
    buyerEmail: string;
    sellerEmail: string;
    amountMinor: number;
    currency: string;
    fees?: { marketplaceFeeMinor?: number; processingFeeMinor?: number };
  }): Buffer {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(18).text('Receipt', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Order ID: ${params.orderId}`);
      doc.text(`Listing: ${params.listingTitle}`);
      doc.text(`Buyer: ${params.buyerEmail}`);
      doc.text(`Seller: ${params.sellerEmail}`);
      doc.moveDown();

      const amount = (params.amountMinor / 100).toFixed(2);
      doc.text(`Amount: ${amount} ${params.currency}`);
      if (params.fees?.marketplaceFeeMinor != null) {
        doc.text(`Marketplace fee: ${(params.fees.marketplaceFeeMinor / 100).toFixed(2)} ${params.currency}`);
      }
      if (params.fees?.processingFeeMinor != null) {
        doc.text(`Processing fee: ${(params.fees.processingFeeMinor / 100).toFixed(2)} ${params.currency}`);
      }
      doc.end();
    }) as unknown as Buffer; // narrow type for sync return not possible due to stream
  }
}


