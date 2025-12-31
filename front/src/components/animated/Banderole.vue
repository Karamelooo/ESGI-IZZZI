<script lang="ts" setup></script>

<template>
  <div class="banderole">
    <p>
      <span>100% made in France</span><span>•</span> <span>Assistance via IA</span><span>•</span>
      <span>Retours sincères</span><span>•</span> <span>Qualiopi Friendly</span><span>•</span>
      <span>Double satisfaction</span><span>•</span> <span>Pôle qualité</span><span>•</span>
      <span>Version gratuite à vie</span><span>•</span> <span>+73% de retours</span><span>•</span>
      <span>Amélioration continue</span><span>•</span>
      <span>Gratuit à vie</span><span>•</span>

      <span>100% made in France</span><span>•</span> <span>Assistance via IA</span><span>•</span>
      <span>Retours sincères</span><span>•</span> <span>Qualiopi Friendly</span><span>•</span>
      <span>Double satisfaction</span><span>•</span> <span>Pôle qualité</span><span>•</span>
      <span>Version gratuite à vie</span><span>•</span> <span>+73% de retours</span><span>•</span>
      <span>Amélioration continue</span><span>•</span>
      <span>Gratuit à vie</span><span>•</span>
    </p>
  </div>
</template>

<style scoped>
.banderole {
  height: 53px;
  padding: 1rem;
  width: 100%;
  background-color: var(--dark-orange);
  color: #fff;
  overflow: hidden;
  font-family: 'Mochiy Pop One';
}

.banderole p {
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: 1rem;
  height: 100%;
  animation: translation 20s infinite linear;
  padding-right: 1rem;
}

@keyframes translation {
  0% {
    transform: translate(0%);
  }
  100% {
    transform: translate(-50%);
  }
}
</style>
