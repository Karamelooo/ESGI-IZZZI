<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    disabled?: boolean;
    icon?: string;
    color?: string;
    label?: string;
    labelPosition?: string;
  }>(),
  {
    disabled: false,
    color: 'var(--gray-100)',
    labelPosition: 'right',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
}
</script>

<template>
  <div
    class="radio-root"
    :class="{ 'radio--checked': modelValue, 'radio--disabled': disabled }"
    :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
    @click="toggle"
    @keydown.space.prevent="toggle"
    tabindex="0"
    role="radio"
    :aria-checked="modelValue"
    :aria-disabled="disabled"
  >
    <span v-if="label && labelPosition === 'left'" class="radio-label">{{ label }}</span>

    <div class="radio-inner">
      <template v-if="modelValue">
        <Icon v-if="icon" :name="icon" :color="color" class="radio-icon" />
        <span
          v-else
          class="radio-dot"
          :style="{
            backgroundColor: color ?? 'var(--gray-100)',
          }"
        />
      </template>
    </div>

    <span v-if="label && labelPosition === 'right'" class="radio-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.radio-root {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  outline: none;
}

.radio--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.radio-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--gray-100);
  border-radius: 50%;
  transition: border 0.2s ease-in-out;
}

.radio-dot {
  display: block;
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

.radio-icon {
  width: 12px;
  height: 12px;
}

.radio-label {
  position: relative;
  top: 1px;
  font-size: 14px;
  user-select: none;
}
</style>
