<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    options: Array<{
      value?: string;
      label?: string;
      disabled?: boolean;
      color?: string;
      labelPosition?: string;
    }>;
    color?: string;
    labelPosition?: string;
    disabled?: boolean;
    name?: string;
  }>(),
  {
    labelPosition: 'right',
    disabled: false,
    name: undefined,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
  (e: 'change', value: string[], index: number): void;
}>();

function handleSelect(value: string, index: number) {
  const values = props.modelValue ? [...props.modelValue] : [];
  const i = values.indexOf(value);
  if (i === -1) {
    values.push(value);
  } else {
    values.splice(i, 1);
  }
  emit('update:modelValue', values);
  emit('change', values, index);
}
</script>

<template>
  <div class="checkbox-group-root" role="group">
    <input v-if="name" type="hidden" :name="name" :value="modelValue?.join(',')" />

    <CheckBox
      v-for="(option, index) in options"
      :key="option.value ?? `checkbox-${index}`"
      :model-value="modelValue?.includes(option.value ?? `checkbox-${index}`) ?? false"
      :value="option.value ?? `checkbox-${index}`"
      :index="index"
      :label="option.label"
      :color="option.color ?? color"
      :label-position="option.labelPosition ?? labelPosition"
      :disabled="option.disabled ?? disabled"
      @select="handleSelect"
    />
  </div>
</template>

<style scoped>
.checkbox-group-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
