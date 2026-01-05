<script lang="ts" setup>
defineProps<{
  activeTab: number;
  maxHeight?: string;
}>();
</script>

<template>
  <div :class="{ scrollable: maxHeight }" :style="{ maxHeight: maxHeight }">
    <slot :name="`tab-${activeTab}`"></slot>
  </div>
</template>

<style scoped>
.scrollable {
  overflow-y: auto;
}
</style>
