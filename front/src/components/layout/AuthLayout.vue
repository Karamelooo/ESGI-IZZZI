<script lang="ts" setup>
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="auth-layout">
    <div class="auth-card">
      <div class="auth-header">
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 50vw;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.auth-header {
  text-align: center;
}

.auth-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-100);
  margin-bottom: 8px;
}

.auth-header p {
  color: var(--gray-60);
  font-size: 14px;
  font-size: 14px;
}

@media (max-width: 600px) {
  .auth-layout {
    padding: 16px;
    align-items: flex-start;
  }
  
  .auth-card {
    padding: 24px;
    margin-top: 20px;
    gap: 24px;
  }

  .auth-header h1 {
    font-size: 20px;
  }
}
</style>
