import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @RequirePermissions('institution:manage')
  async create(
    @CurrentUser() user: any,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.create(
      Number(user.userId),
      createSubscriptionDto,
    );
  }

  @Post('free')
  @UseGuards(AccessTokenGuard)
  async createFree(@CurrentUser() user: any) {
    return this.subscriptionService.createFree(Number(user.userId));
  }
}
