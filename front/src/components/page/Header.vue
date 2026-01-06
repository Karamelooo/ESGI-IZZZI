<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import AdminNavBar from './AdminNavBar.vue';
import NavBar from './NavBar.vue';
import Profile from './Profile.vue';
import { isAdminRoute } from '@utils/route';

const route = useRoute();
const router = useRouter();
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

async function logout() {
  await authStore.logout();
  router.push('/');
}
</script>

<template>
  <header
    class="header"
    :class="{ 'header--admin': isAdminRoute(route.path), 'header--authenticated': authStore.isAuthenticated }"
  >
    <Logo :linkToHome="true" />

    <component :is="isAdminRoute(route.path) ? AdminNavBar : NavBar" class="header-component" />

    <div class="header-menu-mobile">
      <Button icon="burger" iconPosition="right" @click="openMobileMenu">Menu</Button>
    </div>

    <Profile v-if="authStore.isAuthenticated" />

    <div v-if="authStore.isAuthenticated" class="header-logout">
      <Button variant="neutral" @click="logout">Déconnexion</Button>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 90%;
  height: 6em;
  margin: 1em 0;
  padding: 0 20px;
  border-radius: 8px;
  gap: 32px;
  display: grid;
  position: fixed;
  top: 0;
  z-index: 500;
  align-self: center;
  justify-self: center;
  grid-template-columns: auto 1fr auto;
  background-color: var(--white);
}

.header--authenticated {
  grid-template-columns: auto 1fr auto auto;
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

.header-logout {
  margin: auto 0;
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
