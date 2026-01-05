<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { useApi } from '@/api/axios';

const router = useRouter();
const authStore = useAuthStore();
const api = useApi();

const subscription = ref<any>(null);

const planName = computed(() => {
  if (!subscription.value) return null;
  return subscription.value.plan;
});

const isSuper = computed(() => planName.value === 'Super Izzzi');
const isIzzzi = computed(() => planName.value === 'Izzzi');
const hasPlan = computed(() => !!planName.value);

onMounted(async () => {
  try {
    const { data } = await api.get('/subscription/me');
    subscription.value = data;
  } catch (e) {
    console.log('No active subscription');
  }
});

function handleNotificationClick() {
  console.log('IconButton clicked!');
}
</script>

<template>
  <div class="wrapper">
    <IconButton @click="handleNotificationClick" icon="Bell-Mobile" size="26px" />

    <div @click="router.push('/classes')" class="profile">
      <Avatar />

      <div class="infos">
        <p class="name">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>

        <div v-if="isSuper" class="role-wrapper--admin">
          <Icon name="Crown" color="var(--white)" />
          <span class="role">Supper Izzzi</span>
        </div>
        <div v-else-if="isIzzzi" class="role-wrapper--default">
          <span class="role">Plan gratuit</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 32px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.infos {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.role {
  font-size: 12px;
  font-weight: 700;
}

.role-wrapper--default {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-wrapper--admin {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 38px;
  background-color: var(--dark-orange);
  color: var(--white);
}

.role-wrapper--izzzi {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 38px;
  color: var(--gray-100);
}
</style>
