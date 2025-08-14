import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly client: Stripe;
  private readonly hasApiKey: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('STRIPE_SECRET_KEY');
    const apiVersion = (this.config.get<string>('STRIPE_API_VERSION') || '2024-06-20') as Stripe.LatestApiVersion | undefined;
    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.warn('[payments] STRIPE_SECRET_KEY not set; Stripe endpoints will be unavailable');
    }
    this.hasApiKey = Boolean(apiKey);
    this.client = new Stripe(apiKey || 'sk_test_placeholder', { apiVersion });
  }

  async getBalance() {
    if (!this.hasApiKey) {
      throw new HttpException(
        { error: { code: 'PAYMENTS_NOT_CONFIGURED', message: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' } },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    return this.client.balance.retrieve();
  }

  async getOrCreateCustomer(params: { userId: string; email: string; name?: string }) {
    if (!this.hasApiKey) {
      throw new HttpException(
        { error: { code: 'PAYMENTS_NOT_CONFIGURED', message: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' } },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Lookup by email to reuse when possible; apps should persist customer id after first creation
    const existing = await this.client.customers.list({ email: params.email, limit: 1 });
    if (existing.data.length > 0) {
      const customer = existing.data[0];
      if (!customer.metadata?.userId && params.userId) {
        await this.client.customers.update(customer.id, { metadata: { ...customer.metadata, userId: params.userId } });
      }
      return customer;
    }

    return this.client.customers.create({
      email: params.email,
      name: params.name,
      metadata: { userId: params.userId },
    });
  }

  async getOrCreateConnectAccount(params: {
    userId: string;
    email: string;
    country?: string;
    businessType?: 'individual' | 'company';
  }) {
    if (!this.hasApiKey) {
      throw new HttpException(
        { error: { code: 'PAYMENTS_NOT_CONFIGURED', message: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' } },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Try to find an existing account by email via search; if not available on your plan, always create and persist mapping in your DB
    // Here we default to creating a new account.
    const account = await this.client.accounts.create({
      type: 'express',
      email: params.email,
      country: params.country,
      business_type: params.businessType,
      metadata: { userId: params.userId },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    return account;
  }

  async createAccountOnboardingLink(params: { accountId: string }) {
    if (!this.hasApiKey) {
      throw new HttpException(
        { error: { code: 'PAYMENTS_NOT_CONFIGURED', message: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' } },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    const link = await this.client.accountLinks.create({
      account: params.accountId,
      refresh_url: this.config.get('APP_BASE_URL') || 'http://localhost:3002/return',
      return_url: this.config.get('APP_BASE_URL') || 'http://localhost:3002/return',
      type: 'account_onboarding',
    });
    return link;
  }
}


