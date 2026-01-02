<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    borderColor?: string;
    backgroundColor?: string;
    autoMargin?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    centered?: boolean;
    padding?: number;
    spacing?: number;
  }>(),
  {
    borderColor: 'var(--gray-10)',
    backgroundColor: 'var(--white)',
    autoMargin: false,
    fullWidth: false,
    fullHeight: false,
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
      backgroundColor,
      alignItems: centered ? 'center' : 'stretch',
      justifyContent: centered ? 'center' : 'stretch',
      padding: padding && `${padding}px`,
      gap: spacing && `${spacing}px`,
      margin: autoMargin ? 'auto' : '0',
      width: fullWidth ? '100%' : 'fit-content',
      height: fullHeight ? '100%' : 'auto',
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .card {
    padding: 16px;
  }
}
</style>
