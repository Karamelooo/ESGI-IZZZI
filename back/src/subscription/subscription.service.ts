import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2025-12-15.clover',
    });
  }

  async create(userId: number, createSubscriptionDto: CreateSubscriptionDto) {
    const { 
        paymentIntentId, 
        plan, 
        billingPeriod, 
        numberOfClasses,
        address,
        city,
        postalCode,
        country,
        email,
        firstName,
        lastName
    } = createSubscriptionDto;

    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['payment_method']
    });

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not succeeded');
    }

    const amount = paymentIntent.amount;

    this.logger.log(`Creating subscription for UserID: ${userId}`);

    const existingSubscription = await this.prisma.subscription.findUnique({
        where: { stripePaymentIntentId: paymentIntentId },
    });

    if (existingSubscription) {
        this.logger.log(`Subscription already exists for PaymentIntent: ${paymentIntentId}`);
        return existingSubscription;
    }

    return this.prisma.subscription.create({
      data: {
        userId,
        plan,
        billingPeriod,
        numberOfClasses,
        amount,
        stripePaymentIntentId: paymentIntentId,
        status: 'active',
        startDate: new Date(),
        billingAddress: address,
        billingCity: city,
        billingPostalCode: postalCode,
        billingCountry: country,
        billingEmail: email,
        billingFirstName: firstName,
        billingLastName: lastName,
        endDate: billingPeriod === 'annual' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1))
      },
    });
  }
}
