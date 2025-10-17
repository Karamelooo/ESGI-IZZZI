<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    activeRoute?: string;
  }>(),
  {
    activeRoute: '/',
  }
);
</script>

<template>
  <nav class="navbar">
    <Button to="/pricing" variant="plain" :class="{ active: activeRoute === '/pricing' }">Nos tarifs</Button>

    <div class="auth">
      <Button to="/auth/register" variant="primary" icon="Arrow" iconPosition="right">S'inscrire</Button>
      <Button to="/auth/login" variant="neutral" icon="Arrow" iconPosition="right">Se connecter</Button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 40px;
}

.auth {
  display: flex;
  align-items: center;
  gap: 20px;
}

.button--plain.active {
  font-weight: 700;
  border-bottom: 3px solid var(--dark-orange);
}
</style>
