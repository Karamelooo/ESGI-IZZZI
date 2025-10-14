<script setup lang="ts">
import Icon from './Icon.vue'
import { useToast } from '../composables/useToast';

const toast = useToast();
</script>

<template>
    <div class="toast-container">
        <div class="toast" :class="toast.class" v-for="toast in toast.toasts" :key="toast.id">
            <Icon :name="toast.icon" />
            <span>{{ toast.message }}</span>
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
  animation: toast-in .2s ease-out, toast-out .2s ease-in 3.8s forwards;
  border:1px solid black;
  border-radius:8px;
  padding:16px;
  display:flex;
  align-content:center;
  gap:8px;
  font-family:'Poppins';
  font-size:12px;
  font-weight:700;
}

.toast-success { background: #10672120; color:#106721; border-color:#106721}
.toast-error   { background: #dc2626; }
.toast-info    { background: #2563eb; }
.toast-warning { background: #d97706; }

@keyframes toast-in { from { opacity: 0; transform: translateY(-6px);} to { opacity:1; transform: translateY(0);} }
@keyframes toast-out { to { opacity: 0; transform: translateY(-6px);} }

</style>