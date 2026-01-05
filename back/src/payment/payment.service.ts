import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      this.logger.error('STRIPE_SECRET_KEY is not defined in the environment variables');
    }
    this.stripe = new Stripe(apiKey || '', {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'eur') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      this.logger.error('Error creating payment intent', error);
      throw error;
    }
  }
}
