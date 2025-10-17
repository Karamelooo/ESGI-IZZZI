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
  <div
    class="icon"
    :style="{
      '--icon-url': `url(src/assets/svg/icons/${props.name}.svg)`,
      '--icon-color': props.color,
      '--icon-size': props.size,
    }"
  ></div>
</template>

<style>
.icon {
  display: inline-block;
  height: var(--icon-size);
  width: var(--icon-size);
  background-color: var(--icon-color);
  mask: var(--icon-url) no-repeat center / contain;
  -webkit-mask: var(--icon-url) no-repeat center / contain;
}
</style>
