<script lang="ts" setup></script>

<template>
  <ToastContainer />

  <div id="root">
    <router-view />
  </div>
</template>

<style scoped>
#root {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px 20px;
}
</style>
