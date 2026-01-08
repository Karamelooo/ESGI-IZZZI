import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { REQUIRE_PAID_PLAN_KEY } from '../decorators/require-paid-plan.decorator';

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePaidPlan = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_PAID_PLAN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requirePaidPlan) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (!userId) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId: Number(userId),
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      throw new ForbiddenException(
        'Cette fonctionnalité nécessite un abonnement actif. Veuillez souscrire à un plan payant.',
      );
    }

    const isPaidPlan =
      subscription.billingPeriod === 'monthly' ||
      subscription.billingPeriod === 'annual';

    if (!isPaidPlan) {
      throw new ForbiddenException(
        'Cette fonctionnalité est réservée aux abonnés du plan Super Izzzi. Veuillez mettre à niveau votre abonnement.',
      );
    }

    return true;
  }
}
