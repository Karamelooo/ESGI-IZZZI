import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('intent')
  @UseGuards(AccessTokenGuard)
  async createPaymentIntent(@Body() body: { amount: number }) {
    return this.paymentService.createPaymentIntent(body.amount);
  }
}
