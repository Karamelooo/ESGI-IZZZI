<script lang="ts" setup>
import { ref } from 'vue';
import Header from '../../components/page/Header.vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const headerActiveTab = ref(0);
</script>

<template>
  <Header :activeTab="headerActiveTab" @update:activeTab="headerActiveTab = $event" />

  <SwitchPanels :activeTab="headerActiveTab">
    <template #tab-0>
      <pre>{{ JSON.stringify(authStore.$state, null, 2) }}</pre>
    </template>
    <template #tab-1>
      <p>Dashboard</p>
    </template>
  </SwitchPanels>
</template>

<style scoped></style>
