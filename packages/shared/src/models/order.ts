export type OrderState =
  | 'created'
  | 'paid'
  | 'fulfilled'
  | 'completed'
  | 'canceled'
  | 'refunded'
  | 'disputed';

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  amount_total: number; // minor units
  currency: string; // ISO 4217
  state: OrderState;
  timeline?: Array<{ at: string; state: OrderState; note?: string }>;
}

