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
    padding: 48,
    spacing: 48,
  }
);
</script>

<template>
  <div
    class="card"
    :style="{
      border: `1px solid ${borderColor}`,
      backgroundColor: backgroundColor,
      alignItems: centered ? 'center' : 'stretch',
      padding: `${padding}px`,
      gap: `${spacing}px`,
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
}
</style>
