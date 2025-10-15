<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="icon">
    <img :src="`src/assets/svg/${props.name}.svg`" alt="icon" />
  </div>
</template>
