<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    borderColor?: string;
    backgroundColor?: string;
    centered?: boolean;
    padding?: number;
    spacing?: number;
  }>(),
  {
    borderColor: 'var(--gray-10)',
    backgroundColor: 'var(--white)',
    centered: false,
  }
);
</script>

<template>
  <div
    class="card"
    :style="{
      border: `1px solid ${borderColor}`,
      backgroundColor,
      alignItems: centered ? 'center' : 'stretch',
      padding: padding && `${padding}px`,
      gap: spacing && `${spacing}px`,
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: 48px;
  gap: 48px;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .card {
    padding: 16px;
  }
}
</style>
