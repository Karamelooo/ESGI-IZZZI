<script lang="ts" setup>
import { useRoute } from 'vue-router';
import AdminNavBar from './AdminNavBar.vue';
import NavBar from './NavBar.vue';
import Profile from './Profile.vue';
import { useAuthStore } from '@stores/auth';

const props = defineProps<{
  activeTab: number;
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', value: number): void;
}>();

const route = useRoute();
const authStore = useAuthStore();
</script>

<template>
  <header class="header">
    <Logo :linkToHome="true" />

    <component
      :is="authStore.isAuthenticated ? AdminNavBar : NavBar"
      :activeTab="props.activeTab"
      :activeRoute="route.path"
      v-bind="
        authStore.isAuthenticated ? { 'onUpdate:activeTab': (value: number) => emit('update:activeTab', value) } : {}
      "
    />

    <Profile v-if="authStore.isAuthenticated" />
  </header>
</template>

<style scoped>
.header {
  display: grid;
  position: fixed;
  top: 0;
  z-index: 1000;
  align-self: center;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  background-color: var(--bg-secondary, #fafafa);
  padding: 0 1em;
  margin: 1em 0;
  width: 90%;
  height: 6em;
  border-radius: 1em;
}
</style>
