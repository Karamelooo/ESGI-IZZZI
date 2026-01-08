import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PAID_PLAN_KEY = 'requirePaidPlan';
export const RequirePaidPlan = () => SetMetadata(REQUIRE_PAID_PLAN_KEY, true);
