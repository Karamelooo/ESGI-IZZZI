<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    activeTab: number;
    activeRoute?: string;
    disabled?: boolean;
  }>(),
  {
    activeRoute: '/',
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: 'update:activeTab', value: number): void;
}>();

function onTabChange(index: number) {
  emit('update:activeTab', index);
}
</script>

<template>
  <nav class="navbar navbar--authenticated">
    <div class="">
      <SwitchTabs
        :tabs="[{ name: 'Mes classes' }, { name: 'Dashboard' }]"
        :disabled="disabled"
        :modelValue="activeTab"
        @update:modelValue="onTabChange"
      />
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
