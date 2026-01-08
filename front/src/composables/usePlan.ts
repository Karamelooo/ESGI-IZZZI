import { computed } from 'vue';
import { useAuthStore } from '@stores/auth';

export function usePlan() {
  const authStore = useAuthStore();

  const isFreePlan = computed(() => {
    const subscription = authStore.user?.subscription;
    if (!subscription) return true;
    return subscription.billingPeriod === 'trial';
  });

  const isPaidPlan = computed(() => {
    const subscription = authStore.user?.subscription;
    if (!subscription) return false;
    return subscription.billingPeriod === 'monthly' || subscription.billingPeriod === 'annual';
  });

  const restrictedFeatures = ['ai-synthesis', 'qr-code'] as const;
  type RestrictedFeature = (typeof restrictedFeatures)[number];

  const canAccess = (feature: RestrictedFeature | string): boolean => {
    if (!restrictedFeatures.includes(feature as RestrictedFeature)) {
      return true;
    }
    return isPaidPlan.value;
  };

  return {
    isFreePlan,
    isPaidPlan,
    canAccess,
    restrictedFeatures,
  };
}
