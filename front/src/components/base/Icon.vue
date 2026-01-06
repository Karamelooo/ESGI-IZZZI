<script lang="ts" setup>
import { computed } from 'vue';

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

const icons = import.meta.glob('/src/assets/svg/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Create a map of filename -> url for robust lookup
const iconMap = Object.fromEntries(
  Object.entries(icons).map(([path, url]) => {
    const filename = path.split('/').pop()?.replace('.svg', '');
    return [filename, url];
  })
);

const iconUrl = computed(() => {
  // Try exact match first, then by filename
  if (!iconMap[props.name]) return '';
  return `url(${iconMap[props.name]})`;
});
</script>

<template>
  <div
    class="icon"
    :style="{
      '--icon-url': iconUrl,
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
  -webkit-mask-image: var(--icon-url);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-image: var(--icon-url);
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}
</style>
