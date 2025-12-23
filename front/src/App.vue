<script lang="ts" setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchMe();
});
</script>

<template>
  <ToastContainer />

  <div id="root">
    <router-view />
  </div>
</template>
