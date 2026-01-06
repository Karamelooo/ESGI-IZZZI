<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import Icon from '@/components/base/Icon.vue';

const router = useRouter();
const authStore = useAuthStore();

const isFreePlan = computed(() => {
  return authStore.user?.subscription?.plan === 'Izzzi';
});

const trialEndDate = computed(() => {
  if (!authStore.user?.subscription?.endDate) return '';
  const date = new Date(authStore.user.subscription.endDate);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});
</script>

<template>
  <div v-if="isFreePlan" class="trial-banner">
    <div class="trial-banner-left">
      <div class="info-icon">
        <Icon name="Info-Desktop" size="24px" color="var(--dark-orange)" />
      </div>
      <p>
        <span class="bold">Période d'essai en cours :</span><br />
        tout est illimité jusqu'au {{ trialEndDate }}.
      </p>
    </div>
    <div class="trial-banner-right" @click="router.push('/pricing')">
      <span>Je passe au plan Super Izzzi</span>
      <Icon name="Arrow" size="18px" color="var(--dark-orange)" />
    </div>
  </div>
</template>

<style scoped>
.trial-banner {
  max-width: 1200px;
  margin: 110px auto -80px;
  padding: 16px 24px;
  background-color: #FFF0D9;
  border: 1px solid var(--dark-orange);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  z-index: 400;
  position: relative;
  top:2rem;
}

.trial-banner-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trial-banner-left p {
  color: var(--dark-orange);
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
}

.trial-banner-left .bold {
  font-weight: 700;
}

.trial-banner-right {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dark-orange);
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.trial-banner-right:hover {
  text-decoration: underline;
}

@media (max-width: 1240px) {
  .trial-banner {
    margin: 110px 20px -80px;
  }
}

@media (max-width: 768px) {
  .trial-banner {
    flex-direction: column;
    align-items: flex-start;
    margin: 90px 20px -60px;
  }
  
  .trial-banner-right {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
