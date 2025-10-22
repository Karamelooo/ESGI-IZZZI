<script lang="ts" setup>
import { useRoute } from 'vue-router';
import AdminNavBar from './AdminNavBar.vue';
import NavBar from './NavBar.vue';
import Profile from './Profile.vue';

const props = defineProps<{
  activeTab: number;
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', value: number): void;
}>();

const route = useRoute();

const user = {
  firstName: 'Yoann',
  lastName: 'C.',
  role: 'admin',
};

const isAuthenticated = true;
</script>

<template>
  <header class="header">
    <Logo :linkToHome="true" />

    <component
      :is="isAuthenticated ? AdminNavBar : NavBar"
      :activeTab="props.activeTab"
      :activeRoute="route.path"
      v-bind="isAuthenticated ? { 'onUpdate:activeTab': (value: number) => emit('update:activeTab', value) } : {}"
    />

    <Profile v-if="isAuthenticated" :user="user" />
  </header>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  align-items: center;
  padding: 0 20px;
  height: 96px;
}
</style>
