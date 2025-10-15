<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue: number;
  tabs: { name: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const setTab = (index: number) => {
  emit('update:modelValue', index);
};
</script>

<template>
  <div class="switch-tabs">
    <Button
      v-for="(tab, index) in tabs"
      :key="index"
      :variant="modelValue === index ? 'switch' : 'plain'"
      :inSwitchComponent="true"
      @click="setTab(index)"
    >
      {{ tab.name }}
    </Button>
  </div>
</template>

<style scoped>
.switch-tabs {
  display: flex;
  gap: 20px;
}
</style>
