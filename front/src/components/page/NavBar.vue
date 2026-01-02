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
    <Button link="/pricing" variant="plain" :class="{ active: activeRoute === '/pricing' }">Nos tarifs</Button>

    <div class="auth">
      <Button link="/auth" variant="primary" icon="Arrow" iconPosition="right">S'inscrire</Button>
      <Button link="/auth" variant="neutral" icon="Arrow" iconPosition="right">Se connecter</Button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: end;
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
