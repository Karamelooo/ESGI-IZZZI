<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { isHeaderInApp, isPublicRoute } from '@utils/route';
import Header from '@components/page/Header.vue';
import MobileMenu from '@components/page/MobileMenu.vue';
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchMe();

  window.addEventListener('resize', () => {
    if (window.innerWidth < 960 && !isPublicRoute(route.path)) {
      router.push('/desktop-only');
    }
  });
});

const isMobileMenuOpen = ref(false);
</script>

<template>
  <ToastContainer />

  <div id="root">
    <Header v-if="isHeaderInApp(route.path)" @openMobileMenu="isMobileMenuOpen = true" />
    <MobileMenu
      :isOpen="isMobileMenuOpen"
      :isAuthenticated="authStore.isAuthenticated"
      :activeRoute="route.path"
      @close="isMobileMenuOpen = false"
    />
    <router-view />
  </div>
</template>
