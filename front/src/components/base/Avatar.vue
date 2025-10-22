<script lang="ts" setup>
const avatarUrl = null;
const defaultAvatarUrl = '/src/assets/images/avatar-placeholder.png';
</script>

<template>
  <img v-if="avatarUrl" class="avatar" :src="avatarUrl" alt="Profile picture" />
  <img v-else class="avatar" :src="defaultAvatarUrl" alt="Profile picture" />
</template>

<style scoped>
.avatar {
  width: 51px;
  height: 51px;
  border-radius: 50%;
  overflow: hidden;
}
</style>
