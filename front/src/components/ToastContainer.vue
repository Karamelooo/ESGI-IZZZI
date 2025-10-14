<script setup lang="ts">
import Icon from './Icon.vue'
import { useToast } from '../composables/useToast';

const toast = useToast();
</script>

<template>
    <div class="toast-container">
        <div class="toast" :class="toast.class" v-for="toast in toast.toasts" :key="toast.id">
            <div class="toast-header">
                <Icon :name="toast.icon" />
                <span>{{ toast.title }}</span>
            </div>
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
  border:1px solid black;
  border-radius:8px;
  padding:16px;
  display:flex;
  flex-direction: column;
  align-content:center;
  font-family:'Poppins';
  font-size:12px;
  animation: toast-in .2s ease-out, toast-out .2s ease-in 3.8s forwards;
}

.toast-header {
    display:flex;
    align-items:center;
    gap:8px;
    font-weight:700;
    white-space: pre-line;
}

.toast-success { background: #10672120; color:#106721; border-color:#106721}
.toast-positive { background: #106721; color:#FFFEF7; border-color:#106721}
.toast-negative { background: #F26103; color:#FFFEF7; border-color:#F26103}
.toast-info, .toast-warning, .toast-lock-warning { background: #FDD2B7; color:#F26103; border-color:#F26103}
.toast-info-warning, .toast-lock { background: #F69D0433; color:#F69D04; border-color:#F69D04}

@keyframes toast-in { from { opacity: 0; transform: translateY(-6px);} to { opacity:1; transform: translateY(0);} }
@keyframes toast-out { to { opacity: 0; transform: translateY(-6px);} }

</style>