<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options: Array<{
      value?: string;
      label?: string;
      icon?: string;
      disabled?: boolean;
      color?: string;
      labelPosition?: string;
    }>;
    icon?: string;
    color?: string;
    labelPosition?: string;
    disabled?: boolean;
    name?: string;
  }>(),
  {
    icon: '',
    color: 'var(--gray-100)',
    labelPosition: 'right',
    disabled: false,
    name: undefined,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string, index: number): void;
}>();

function handleSelect(value: string, index: number) {
  emit('update:modelValue', value);
  emit('change', value, index);
}
</script>

<template>
  <div class="radio-group-root" role="radiogroup">
    <input v-if="name" type="hidden" :name="name" :value="modelValue" />

    <Radio
      v-for="(option, index) in options"
      :key="option.value ?? `radio-${index}`"
      :model-value="modelValue === (option.value ?? `radio-${index}`)"
      :value="option.value"
      :index="index"
      :label="option.label"
      :icon="option.icon ?? icon"
      :color="option.color ?? color"
      :label-position="option.labelPosition ?? labelPosition"
      :disabled="option.disabled ?? disabled"
      @select="handleSelect"
    />
  </div>
</template>

<style scoped>
.radio-group-root {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
