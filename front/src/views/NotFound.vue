<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="not-found-container">
    <div class="nf-content">
      <h2 class="nf-title">Vous n'allez pas collecter beaucoup d'avis ici...</h2>
      <p class="nf-message">Il semble que cette page n'existe pas ou ait été supprimée.</p>
      <Button icon="Arrow" iconPosition="right" @click="goHome">Retour à l'accueil</Button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.nf-content {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.nf-title {
  font-size: 42px;
  font-weight: 600;
}

.nf-message {
  line-height: 1.5;
}
</style>
