import { IsInt, IsOptional, IsString, IsUUID, Min, Length, IsIn } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsUUID()
  orderId!: string;

  @IsInt()
  @Min(1)
  amountMinor!: number;

  @IsString()
  @Length(3, 3)
  currency!: string; // ISO 4217, e.g., 'USD'

  @IsOptional()
  @IsString()
  buyerStripeCustomerId?: string;

  @IsOptional()
  @IsString()
  sellerStripeAccountId?: string; // Connect destination

  @IsOptional()
  @IsInt()
  @Min(0)
  applicationFeeMinor?: number; // Marketplace fee in minor units (optional; Step 5 will compute)

  @IsOptional()
  @IsIn(['automatic', 'manual'])
  captureMethod?: 'automatic' | 'manual';

  @IsOptional()
  @IsIn(['automatic', 'any'])
  requestThreeDSecure?: 'automatic' | 'any';
}


