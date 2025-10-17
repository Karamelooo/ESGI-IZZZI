<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <header class="header">
    <Logo :linkToHome="true" />
    <NavBar :activeRoute="route.path" />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 96px;
}
</style>
