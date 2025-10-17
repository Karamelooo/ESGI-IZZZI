<script lang="ts" setup>
import { defineProps } from 'vue';

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
