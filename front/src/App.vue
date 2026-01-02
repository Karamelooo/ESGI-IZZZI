<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import Header from '@components/page/Header.vue';
import MobileMenu from '@components/page/MobileMenu.vue';
import { isAdminRoute } from '@utils/route';

const route = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchMe();
});

const isMobileMenuOpen = ref(false);
</script>

<template>
  <ToastContainer />

  <div id="root">
    <Header v-if="!isAdminRoute(route.path)" @openMobileMenu="isMobileMenuOpen = true" />
    <MobileMenu
      :isOpen="isMobileMenuOpen"
      :isAuthenticated="authStore.isAuthenticated"
      :activeRoute="route.path"
      @close="isMobileMenuOpen = false"
    />
    <router-view />
  </div>
</template>
