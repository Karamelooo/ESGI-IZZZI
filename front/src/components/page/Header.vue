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

const emit = defineEmits<{
  (e: 'update:activeTab', value: number): void;
  (e: 'openMobileMenu'): void;
}>();

const openMobileMenu = () => {
  emit('openMobileMenu');
};

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
      class="header-component"
    />

    <div class="header-menu-mobile">
      <Button icon="burger" iconPosition="right" @click="openMobileMenu">Menu</Button>
    </div>

    <Profile v-if="authStore.isAuthenticated && authStore.user" :user="authStore.user" />
  </header>
</template>

<style scoped>
.header {
  display: grid;
  position: fixed;
  top: 0;
  z-index: 1000;
  align-self: center;
  justify-self: center;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  align-items: center;
  padding: 0 20px;
  height: 96px;
  border-radius: 8px;
  background-color: var(--white);
}

.header-menu-mobile {
  display: none;
}

@media screen and (max-width: 768px) {
  .header .header-component {
    display: none;
  }

  .header .header-menu-mobile {
    display: block;
    justify-self: end;
    align-self: center;
  }

  .header-menu-mobile button {
    height: 3.5em;
    font-size: 1.2em;
  }
}
</style>
