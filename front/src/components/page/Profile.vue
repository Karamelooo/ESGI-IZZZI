<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isSuper = true;

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
          <span class="role">Super</span>
        </div>

        <div v-else class="role-wrapper--default">
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
</style>
