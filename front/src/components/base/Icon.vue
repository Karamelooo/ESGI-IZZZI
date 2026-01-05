<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    name: string;
    color?: string;
    size?: string;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
  }>(),
  {
    color: 'black',
    size: '16px',
    flipHorizontal: false,
    flipVertical: false,
  }
);
</script>

<template>
  <div
    class="icon"
    :style="{
      '--icon-url': `url(/src/assets/svg/icons/${props.name}.svg)`,
      '--icon-color': props.color,
      '--icon-size': props.size,
      transform: [props.flipHorizontal ? 'scaleX(-1)' : '', props.flipVertical ? 'scaleY(-1)' : '']
        .filter(Boolean)
        .join(' '),
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
