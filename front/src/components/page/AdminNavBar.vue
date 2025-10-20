<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    activeTab: number;
    activeRoute?: string;
  }>(),
  {
    activeRoute: '/',
  }
);

const emit = defineEmits<{
  (e: 'update:activeTab', value: number): void;
}>();

const switchTabs = [{ name: 'Mes classes' }, { name: 'Dashboard' }];

function onTabChange(index: number) {
  emit('update:activeTab', index);
}
</script>

<template>
  <nav class="navbar navbar--authenticated">
    <div class="">
      <SwitchTabs :tabs="switchTabs" :modelValue="props.activeTab" @update:modelValue="onTabChange" />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-self: center;
  gap: 40px;
}
</style>
