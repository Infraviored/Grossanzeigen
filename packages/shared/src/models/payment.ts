export interface Payment {
  order_id: string;
  stripe_payment_intent_id: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  fees?: {
    marketplace_fee?: number; // minor units
    processing_fee?: number; // minor units
  };
  stripe_charge_id?: string;
}

