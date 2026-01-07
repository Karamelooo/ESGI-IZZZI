<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import AdminNavBar from './AdminNavBar.vue';
import NavBar from './NavBar.vue';
import Profile from './Profile.vue';
import InviteModal from './InviteModal.vue'; // Import Modal
import { isAdminRoute } from '@utils/route';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const showInviteModal = ref(false);

const canShare = computed(() => {
  return authStore.isAuthenticated && ['admin', 'owner'].includes(authStore.user?.role ?? '');
});

withDefaults(
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
    :class="{
      'header--admin': isAdminRoute(route.path),
      'header--authenticated': authStore.isAuthenticated,
      'header--with-share': canShare
    }"
  >
    <Logo :linkToHome="true" />

    <component :is="isAdminRoute(route.path) ? AdminNavBar : NavBar" class="header-component" />

    <div class="header-menu-mobile">
      <Button icon="burger" iconPosition="right" @click="openMobileMenu">Menu</Button>
    </div>

    <Profile v-if="authStore.isAuthenticated" />

    <div v-if="canShare" class="header-share">
      <Button variant="primary" @click="showInviteModal = true">Partager</Button>
    </div>

    <div v-if="authStore.isAuthenticated" class="header-logout">
      <Button variant="neutral" @click="logout">Déconnexion</Button>
    </div>

    <InviteModal :isOpen="showInviteModal" @close="showInviteModal = false" />
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

.header--authenticated.header--with-share {
  grid-template-columns: auto 1fr auto auto auto;
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

.header-logout, .header-share {
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
