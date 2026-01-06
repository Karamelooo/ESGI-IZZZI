<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useClickOutside } from '@composables/useClickOutside';
import Card from '@components/layout/Card.vue';

type Option = {
  label: string;
  value: string | number;
};

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    options: Option[];
    placeholder?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
  }>(),
  {
    name: '',
    disabled: false,
    required: false,
    options: () => [],
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);

useClickOutside(selectRef, () => {
  isOpen.value = false;
});

const selectedOption = computed(() => {
  return props.options.find((o) => o.value === props.modelValue);
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value);
  isOpen.value = false;
};

const triggerClass = computed(() => ({
  'select-trigger--open': isOpen.value,
  'select-trigger--disabled': props.disabled,
  'select-trigger--placeholder': !selectedOption.value,
}));
</script>

<template>
  <div class="select-wrapper" ref="selectRef">
    <div class="select-trigger" :class="triggerClass" @click="toggleDropdown">
      <span class="select-value">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>

      <span class="select-icon">
        <Icon name="Arrowdown" />
      </span>
    </div>

    <div v-if="isOpen" class="select-dropdown">
      <Card :padding="0" :spacing="0" class="select-card">
        <div class="options-container">
          <span
            v-for="option in options"
            :key="option.value"
            class="select-option"
            :class="{ 'select-option--selected': option.value === modelValue }"
            @click.stop="selectOption(option)"
          >
            {{ option.label }}
          </span>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.select-wrapper {
  position: relative;
  width: 100%;
  min-width: 200px;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid var(--gray-15);
  border-radius: 6px;
  padding: 8px 12px;
  background-color: var(--white);
  cursor: pointer;
  transition: border-color 0.2s;
  user-select: none;
  height: 40px;
}

.select-trigger--open {
  border-color: var(--primary);
}

.select-trigger--disabled {
  background-color: var(--gray-2);
  cursor: not-allowed;
  opacity: 0.6;
}

.select-value {
  font-size: 14px;
  color: var(--black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-trigger--placeholder .select-value {
  color: var(--gray-100);
}

.select-icon {
  display: flex;
  align-items: center;
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  z-index: 100;
}

.select-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.options-container {
  display: flex;
  flex-direction: column;
  max-height: 240px;
  overflow-y: auto;
}

.select-option {
  padding: 10px 16px;
  font-size: 14px;
  color: var(--black);
  cursor: pointer;
  transition: background-color 0.2s;
}

.select-option:hover {
  background-color: var(--gray-2);
}

.select-option--selected {
  font-weight: 700;
}
</style>
