<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import AdminNavBar from './AdminNavBar.vue';
import NavBar from './NavBar.vue';
import Profile from './Profile.vue';
import { isAdminRoute } from '@utils/route';

const route = useRoute();
const authStore = useAuthStore();

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: 'openMobileMenu'): void;
}>();

const openMobileMenu = () => {
  emit('openMobileMenu');
};
</script>

<template>
  <header class="header" :class="{ 'header--admin': isAdminRoute(route.path) }">
    <Logo :linkToHome="true" />

    <component :is="isAdminRoute(route.path) ? AdminNavBar : NavBar" class="header-component" />

    <div class="header-menu-mobile">
      <Button icon="burger" iconPosition="right" @click="openMobileMenu">Menu</Button>
    </div>

    <Profile v-if="authStore.isAuthenticated" />
  </header>
</template>

<style scoped>
.header {
  width: 90%;
  height: 6em;
  margin: 1em 0;
  padding: 0 20px;
  border-radius: 8px;
  display: grid;
  position: fixed;
  top: 0;
  z-index: 500;
  align-self: center;
  justify-self: center;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  background-color: var(--white);
}

.header--admin {
  width: 100%;
  height: 96px;
  min-height: 96px;
  margin: 0;
  position: sticky;
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
