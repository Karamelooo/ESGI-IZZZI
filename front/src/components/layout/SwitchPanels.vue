<script lang="ts" setup>
const props = defineProps<{
  activeTab: number;
}>();
</script>

<template>
  <div class="switch-content">
    <slot :name="`tab-${activeTab}`"></slot>
  </div>
</template>

<style scoped>
.switch-content {
  margin-top: 12px;
}
</style>
