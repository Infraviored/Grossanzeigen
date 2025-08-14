import { Injectable } from '@nestjs/common';

@Injectable()
export class FeesService {
  // Simple default fees; make configurable via env later
  private readonly marketplaceFeeRate = 0.1; // 10%
  private readonly processingFeeRate = 0.029; // 2.9%
  private readonly processingFixedMinor = 30; // e.g., 30 cents

  quote(amountMinor: number) {
    const applicationFeeMinor = Math.floor(amountMinor * this.marketplaceFeeRate);
    const processingFeeMinor = Math.floor(amountMinor * this.processingFeeRate) + this.processingFixedMinor;
    const totalMinor = amountMinor + applicationFeeMinor + processingFeeMinor;
    return { applicationFeeMinor, processingFeeMinor, totalMinor };
  }
}


