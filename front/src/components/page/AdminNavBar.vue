<script lang="ts" setup>
import { useRoute } from 'vue-router';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const route = useRoute();

const isDashboard = () => route.path.startsWith('/dashboard');
</script>

<template>
  <nav class="navbar navbar--authenticated">
    <div class="switch-tabs">
      <Button
        link="/classes"
        :variant="!isDashboard() ? 'switch' : 'plain'"
        :inSwitchComponent="true"
        :disabled="disabled"
      >
        Mes classes
      </Button>
      <Button
        link="/dashboard"
        :variant="isDashboard() ? 'switch' : 'plain'"
        :inSwitchComponent="true"
        :disabled="disabled"
      >
        Dashboard
      </Button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-self: center;
  gap: 40px;
}

.switch-tabs {
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--gray-15);
  border-radius: 8px;
  background-color: var(--gray-5);
}
</style>
