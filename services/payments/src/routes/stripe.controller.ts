import { Body, Controller, Get, Post } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { InitCustomerDto } from '../dto/customers.dto';
import { CreateConnectAccountDto, CreateOnboardingLinkDto } from '../dto/connect.dto';

@Controller('payments/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('balance')
  async getBalance() {
    return this.stripeService.getBalance();
  }

  @Post('customers/init')
  async initCustomer(@Body() body: InitCustomerDto) {
    const customer = await this.stripeService.getOrCreateCustomer({
      userId: body.userId,
      email: body.email,
      name: body.name,
    });
    return { id: customer.id, email: customer.email, name: customer.name };
  }

  @Post('connect/accounts')
  async createConnectAccount(@Body() body: CreateConnectAccountDto) {
    const account = await this.stripeService.getOrCreateConnectAccount({
      userId: body.userId,
      email: body.email,
      country: body.country,
      businessType: body.businessType,
    });
    return { id: account.id, email: account.email, country: account.country, detailsSubmitted: account.details_submitted };
  }

  @Post('connect/onboarding-link')
  async createOnboardingLink(@Body() body: CreateOnboardingLinkDto) {
    const link = await this.stripeService.createAccountOnboardingLink({ accountId: body.accountId });
    return { url: link.url, expiresAt: link.expires_at };
  }
}


