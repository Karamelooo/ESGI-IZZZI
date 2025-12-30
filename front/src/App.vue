<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@stores/auth';
import { useRoute } from 'vue-router';
import Header from './components/page/Header.vue';
import MobileMenu from './components/page/MobileMenu.vue';

const authStore = useAuthStore();
const route = useRoute();

onMounted(async () => {
  await authStore.fetchMe();
});

const activeTab = ref(0);
const isMobileMenuOpen = ref(false);
</script>

<template>
  <ToastContainer />

  <div id="root">
    <Header v-model:activeTab="activeTab" @openMobileMenu="isMobileMenuOpen = true" />
    <MobileMenu
      :isOpen="isMobileMenuOpen"
      :isAuthenticated="authStore.isAuthenticated"
      v-model:activeTab="activeTab"
      :activeRoute="route.path"
      @close="isMobileMenuOpen = false"
    />
    <router-view />
  </div>
</template>
