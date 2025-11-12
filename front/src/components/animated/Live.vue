<script lang="ts" setup></script>

<template>
  <div class="live">
    <img id="live1" src="../assets/svg/animations/live1.svg" />
    <img id="live2" src="../assets/svg/animations/live2.svg" />
  </div>
</template>

<style scoped>
.live {
  position: relative;
  width: 10px;
}
.live img {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

#live1 {
  animation: opacity 3s infinite ease-in-out;
}

#live2 {
  animation: opacity2 3s infinite ease-in-out;
}

@keyframes opacity {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  90% {
    opacity: 0;
  }
}

@keyframes opacity2 {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
}
</style>
