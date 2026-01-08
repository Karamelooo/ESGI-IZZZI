<script lang="ts" setup>
import Card from '../layout/Card.vue';
import Button from './Button.vue';
import type { ButtonVariant } from './Button.vue';

interface Props {
  isOpen: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  cancelVariant?: ButtonVariant;
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
  confirmVariant: 'primary',
  cancelVariant: 'plain',
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <Card :padding="32" :spacing="20">
        <h3 class="modal-title">{{ title }}</h3>

        <div class="modal-body"><slot></slot></div>

        <div v-if="confirmText || cancelText" class="form-actions">
          <Button v-if="confirmText" :variant="confirmVariant" @click="emit('confirm')">
            {{ confirmText }}
          </Button>

          <Button v-if="cancelText" :variant="cancelVariant" @click="emit('close')">
            {{ cancelText }}
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-title {
  font-weight: 400;
}

.modal-body {
  line-height: 1.25;
}
</style>
