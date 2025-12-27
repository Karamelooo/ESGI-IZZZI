<script lang="ts" setup>
import AdminNavBar from './AdminNavBar.vue';
import NavBar from './NavBar.vue';
import Profile from './Profile.vue';
import { useAuthStore } from '@stores/auth';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const authStore = useAuthStore();
</script>

<template>
  <header class="header">
    <Logo :linkToHome="true" />

    <component :is="authStore.isAuthenticated ? AdminNavBar : NavBar" :disabled="disabled" />

    <Profile v-if="authStore.isAuthenticated" />
  </header>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  align-items: center;
  padding: 0 20px;
  height: 96px;
  border-radius: 8px;
  background-color: var(--white);
}
</style>
