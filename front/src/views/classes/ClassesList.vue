<script lang="ts" setup>
import { computed } from 'vue';
import { useAuthStore } from '@stores/auth';

const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<template>
  <p>Mes classes</p>
  <p>{{ isAuthenticated }}</p>
  <pre>{{ JSON.stringify(authStore.$state, null, 2) }}</pre>
</template>

<style scoped></style>
