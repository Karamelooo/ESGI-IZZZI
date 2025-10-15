<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string;
    color?: string;
    size?: string;
  }>(),
  {
    color: 'black',
    size: '16px',
  }
);
</script>

<template>
  <div class="icon">
    <img
      :src="`src/assets/svg/${props.name}.svg`"
      alt="icon"
      :style="{
        width: props.size,
        height: props.size,
        filter: props.color !== 'black' ? `invert(1) sepia(1) saturate(5) hue-rotate(${props.color})` : undefined,
      }"
    />
  </div>
</template>
