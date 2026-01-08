<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <main class="desktop-only">
    <Header />

    <Card :spacing="36" :centered="true" class="desktop-only-card">
      <h2>Une meilleure expérience sur ordinateur.</h2>
      <p class="desktop-only-description">
        IZZZI est pensé pour être utilisé sur grand écran. Certaines fonctionnalités ne sont pas optimisées pour mobile,
        et risquent de ne pas s'afficher correctement.
      </p>
      <Button icon="Arrow" iconPosition="right" @click="router.push('/')">Retour à l'accueil</Button>
    </Card>
  </main>
</template>

<style scoped>
.desktop-only {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 36px;
  text-align: center;
}

.desktop-only-card {
  max-width: 90%;
  min-height: 78vh;
}

.desktop-only h2 {
  font-size: 36px;
  font-weight: 400;
}

.desktop-only-description {
  font-size: 16px;
  line-height: 1.5;
}
</style>
