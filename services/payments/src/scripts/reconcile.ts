import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

async function main() {
  const config = new ConfigService();
  const apiKey = config.get<string>('STRIPE_SECRET_KEY') || process.env.STRIPE_SECRET_KEY || '';
  const apiVersion = (config.get<string>('STRIPE_API_VERSION') || process.env.STRIPE_API_VERSION || '2024-06-20') as Stripe.LatestApiVersion | undefined;
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.error('No STRIPE_SECRET_KEY; cannot reconcile');
    process.exit(1);
  }
  const stripe = new Stripe(apiKey, { apiVersion });

  // Simple reconciliation: list recent payment_intents and print summary
  const intents = await stripe.paymentIntents.list({ limit: 20 });
  // eslint-disable-next-line no-console
  console.log('Reconciliation report:');
  for (const pi of intents.data) {
    // eslint-disable-next-line no-console
    console.log(`${pi.id} | amount=${pi.amount} ${pi.currency} | status=${pi.status} | orderId=${pi.metadata?.orderId || ''}`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


