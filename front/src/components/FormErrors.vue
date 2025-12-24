<script lang="ts" setup>
defineProps<{
  messages: string[];
}>();
</script>

<template>
  <ul v-if="messages.length" class="form-errors">
    <li v-for="error in messages" :key="error">{{ error }}.</li>
  </ul>
</template>
