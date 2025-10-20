<script lang="ts" setup>
const props = defineProps<{
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}>();

const isSuper = ['super', 'admin'].includes(props.user.role);
const isAdmin = ['admin'].includes(props.user.role);

function handleNotificationClick() {
  console.log('IconButton clicked!');
}
</script>

<template>
  <div class="wrapper">
    <IconButton @click="handleNotificationClick" icon="Bell-Mobile" size="26px" />

    <div class="profile">
      <Avatar />

      <div class="infos">
        <p class="name">{{ props.user.firstName }} {{ props.user.lastName }}</p>

        <div v-if="isSuper" class="role-wrapper--admin">
          <Icon name="Crown" color="var(--white)" />
          <span class="role">Super</span>
        </div>

        <div v-else class="role-wrapper--default">
          <span class="role">Plan gratuit</span>
        </div>
      </div>
    </div>

    <Button v-if="isAdmin">Partager</Button>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 32px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.infos {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.name {
}

.role {
  font-size: 12px;
  font-weight: 700;
}

.role-wrapper--default {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-wrapper--admin {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 38px;
  background-color: var(--dark-orange);
  color: var(--white);
}
</style>
