<script lang="ts" setup>
import { ref } from 'vue';
import Header from '../../components/page/Header.vue';

const headerActiveTab = ref(0);
</script>

<template>
  <Header :activeTab="headerActiveTab" @update:activeTab="headerActiveTab = $event" />

  <SwitchPanels :activeTab="headerActiveTab">
    <template #tab-0>
      <p>Mes classes</p>
    </template>
    <template #tab-1>
      <p>Dashboard</p>
    </template>
  </SwitchPanels>
</template>

<style scoped></style>
