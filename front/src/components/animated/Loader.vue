<script lang="ts" setup></script>

<template>
  <div class="loader">
    <img src="../assets/svg/animations/loader.svg" />
  </div>
</template>

<style scoped>
.loader img {
  width: 16px;
  height: 16px;
  animation: rotation 2s infinite cubic-bezier(0.2, 0.78, 0.78, -0.09);
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
