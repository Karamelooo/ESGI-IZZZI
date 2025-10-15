<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'neutral' | 'plain' | 'switch';
    size?: 'small' | 'medium';
    icon?: string;
    disabled?: boolean;
    inSwitchComponent?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    inSwitchComponent: false,
  }
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :class="['button', `button--${variant}`, `button--${size}`]"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <div class="button-container">
      <slot />
      <Icon v-if="icon" :name="icon" />
    </div>
  </button>
</template>

<style scoped>
.button-container {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* Base styles */
.button {
  color: var(--gray-100);
  padding: 16px 26px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    padding-left 0.2s ease-in-out,
    padding-right 0.2s ease-in-out;
}

/* Size variants */
.button--small {
  padding: 10px 16px;
  font-size: 14px;
}

/* Disabled state */
.button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Primary variant */
.button--primary {
  background-color: var(--primary);
  border: 1px solid var(--primary);
}

.button--primary:hover {
  background-color: var(--secondary);
}

.button--primary:disabled:hover {
  background-color: var(--primary);
}

/* Neutral variant */
.button--neutral {
  background-color: var(--gray-2);
  border: 1px solid var(--gray-10);
}

.button--neutral:hover {
  background-color: var(--gray-10);
}

.button--neutral:disabled:hover {
  background-color: var(--gray-2);
}

/* Plain variant */
.button--plain {
  background-color: transparent;
  border: none;
  padding: 0;
}

.button--plain:hover {
  text-decoration: underline;
}

.button--plain:disabled:hover {
  text-decoration: none;
}

/* Switch variant */
.button--switch {
  background-color: var(--gray-100);
  border: 1px solid var(--gray-100);
  color: var(--gray-2);
}
</style>
