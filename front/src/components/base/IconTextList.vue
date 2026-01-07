<script setup lang="ts">
import Icon from '@/components/base/Icon.vue';

interface Item {
  icon: string;
  text: string;
}

defineProps<{
  items: Item[];
}>();
</script>

<template>
  <div class="icon-text-list">
    <template v-for="(item, index) in items" :key="index">
      <div class="item">
        <Icon :name="item.icon" />
        <p>{{ item.text }}</p>
      </div>
      <div v-if="index < items.length - 1" class="separator"></div>
    </template>
  </div>
</template>

<style scoped>
.icon-text-list {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid var(--gray-15);
}

.item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
}

.item p {
  margin: 0;
}

.separator {
  width: 1px;
  height: 16px;
  background-color: var(--gray-15);
}
</style>
