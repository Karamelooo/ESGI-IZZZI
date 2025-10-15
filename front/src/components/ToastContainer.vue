<script setup lang="ts">
import { useToast } from '../composables/useToast';

const toast = useToast();
</script>

<template>
  <div class="toast-container">
    <div v-for="toast in toast.toasts" :class="['toast', toast.class]" :key="toast.id">
      <div class="toast-content">
        <div class="toast-header">
          <Icon :name="toast.icon" />
          <span>{{ toast.title }}</span>
        </div>
        <span>{{ toast.message }}</span>
      </div>
      <Button v-if="toast.buttonText" variant="plain" icon="Arrow">
        {{ toast.buttonText }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
}

.toast {
  border: 1px solid black;
  border-radius: 8px;
  padding: 16px;
  gap: 80px;
  display: flex;
  align-content: center;
  font-family: 'Poppins';
  font-size: 12px;
  animation:
    toast-in 0.2s ease-out,
    toast-out 0.2s ease-in 3.8s forwards;
}

.toast-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  white-space: pre-line;
}

.toast-success {
  background: #10672120;
  color: #106721;
  border-color: #106721;
}

.toast-positive {
  background: #106721;
  color: #fffef7;
  border-color: #106721;
}

.toast-negative {
  background: #f26103;
  color: #fffef7;
  border-color: #f26103;
}

.toast-info,
.toast-warning,
.toast-lock-warning {
  background: #fdd2b7;
  color: #f26103;
  border-color: #f26103;
}

.toast-info-warning,
.toast-lock {
  background: #f69d0433;
  color: #f69d04;
  border-color: #f69d04;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes toast-out {
  to {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>
