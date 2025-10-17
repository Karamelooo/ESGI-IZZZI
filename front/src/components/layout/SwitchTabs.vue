<script lang="ts" setup>
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
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 10px 40px 10px 10px;
  border: 1px solid var(--gray-15);
  border-radius: 8px;
  background-color: var(--gray-5);
}
</style>
