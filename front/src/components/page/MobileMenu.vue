<script lang="ts" setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import AdminNavBar from './AdminNavBar.vue';
import NavBar from './NavBar.vue';

const props = defineProps<{
  isOpen: boolean;
  isAuthenticated: boolean;
  activeTab?: number;
  activeRoute?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:activeTab', value: number): void;
}>();

const route = useRoute();
watch(
  () => route.path,
  () => {
    emit('close');
  }
);

function onClose() {
  emit('close');
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="mobile-menu-overlay" @click.self="onClose">
      <div class="mobile-menu-content">
        <div class="header">
          <Button icon="close" variant="plain" @click="onClose" class="close-btn">Fermer</Button>
        </div>

        <component
          :is="isAuthenticated ? AdminNavBar : NavBar"
          :activeTab="activeTab"
          :activeRoute="activeRoute"
          v-bind="isAuthenticated ? { 'onUpdate:activeTab': (value: number) => emit('update:activeTab', value) } : {}"
          class="mobile-nav-component"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.mobile-menu-content {
  width: 80%;
  max-width: 300px;
  height: 100%;
  background-color: var(--bg-secondary, #fafafa);
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}

:deep(.mobile-nav-component) {
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  height: auto;
  justify-content: flex-start;
}

:deep(.mobile-nav-component .auth) {
  flex-direction: column;
  width: 100%;
}

:deep(.mobile-nav-component button) {
  width: 100%;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .mobile-menu-content,
.fade-leave-active .mobile-menu-content {
  transition: transform 0.3s ease;
}

.fade-enter-from .mobile-menu-content,
.fade-leave-to .mobile-menu-content {
  transform: translateX(100%);
}
</style>
