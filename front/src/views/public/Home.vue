<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';

const router = useRouter();
const authStore = useAuthStore();
</script>

<template>
  <div style="padding: 20px">
    <p>
      Bienvenue sur IZZZI. Vous êtes
      {{
        authStore.isAuthenticated
          ? 'connecté en tant que ' +
            authStore.user?.firstName +
            ' ' +
            authStore.user?.lastName +
            ' (' +
            authStore.user?.role +
            ').'
          : 'déconnecté.'
      }}
    </p>
    <Button variant="plain" v-if="authStore.isAuthenticated" @click="authStore.logout">Se déconnecter</Button>
    <Button variant="plain" v-else @click="router.push('/auth')">Se connecter</Button>
  </div>
</template>

<style scoped></style>
