<script lang="ts" setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    disabled?: boolean;
    color?: string;
    label?: string;
    labelPosition?: string;
    value?: string;
    index?: number;
  }>(),
  {
    disabled: false,
    color: 'var(--gray-15)',
    labelPosition: 'right',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', value: string, index: number): void;
}>();

const checkBoxValue = props.value ?? `checkbox-${props.index ?? 0}`;

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
    emit('select', checkBoxValue, props.index ?? 0);
  }
}
</script>

<template>
  <div
    class="checkbox-root"
    :class="{ 'checkbox--checked': modelValue, 'checkbox--disabled': disabled }"
    :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
    @click="toggle"
    @keydown.space.prevent="toggle"
    tabindex="0"
    role="checkbox"
    :aria-checked="modelValue"
    :aria-disabled="disabled"
  >
    <span v-if="label && labelPosition === 'left'" class="checkbox-label">{{ label }}</span>

    <div class="checkbox-inner">
      <template v-if="modelValue">
        <Icon
          name="Check-Desktop"
          :color="color === 'default' || color === 'var(--gray-15)' ? 'var(--gray-100)' : color"
          class="checkbox-icon"
        />
      </template>
    </div>

    <span v-if="label && labelPosition === 'right'" class="checkbox-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.checkbox-root {
  display: flex;
  align-items: center;
  gap: 9px;
  user-select: none;
  outline: none;
}

.checkbox--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border-radius: 2px;
  background-color: var(--gray-2);
}

.checkbox-icon {
  width: 15px;
  height: 15px;
}

.checkbox-label {
  position: relative;
  top: 1px;
  font-size: 14px;
  user-select: none;
}
</style>
