<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    icon: string;
    size?: string;
    disabled?: boolean;
  }>(),
  {
    size: '16px',
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <div class="icon-button-wrapper" @click="!props.disabled && emit('click')" :class="{ disabled: props.disabled }">
    <Icon :name="icon" :size="size" />
  </div>
</template>

<style scoped>
.icon-button-wrapper {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--gray-15);
  cursor: pointer;
}

.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
